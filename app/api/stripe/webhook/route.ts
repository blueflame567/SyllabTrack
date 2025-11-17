import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[WEBHOOK] checkout.session.completed received for session ${session.id}`);
        console.log(`[WEBHOOK] Mode: ${session.mode}, Subscription: ${session.subscription}`);
        console.log(`[WEBHOOK] Metadata:`, session.metadata);

        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          const userId = session.metadata?.userId;

          if (!userId) {
            console.error("[WEBHOOK ERROR] No userId in session metadata");
            console.error("[WEBHOOK ERROR] Session metadata:", session.metadata);
            break;
          }

          console.log(`[WEBHOOK] Processing subscription for userId: ${userId}`);

          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          console.log(`[WEBHOOK] Subscription status: ${subscription.status}`);

          // Update user in database
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionTier: "premium",
              subscriptionStatus: subscription.status,
              subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
            },
          });

          console.log(`[WEBHOOK SUCCESS] User ${userId} (${updatedUser.email}) upgraded to premium via subscription ${subscriptionId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        console.log(`[WEBHOOK] customer.subscription.updated for customer ${customerId}`);
        console.log(`[WEBHOOK] Subscription status: ${subscription.status}`);

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error(`[WEBHOOK ERROR] No user found for Stripe customer ${customerId}`);
          break;
        }

        console.log(`[WEBHOOK] Found user ${user.id} (${user.email})`);

        // Update subscription status
        try {
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status,
              subscriptionTier: subscription.status === "active" ? "premium" : "free",
              subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
            },
          });

          console.log(`[WEBHOOK SUCCESS] Updated subscription for user ${user.id}: ${subscription.status}, tier=${updatedUser.subscriptionTier}`);
        } catch (updateError) {
          console.error(`[WEBHOOK ERROR] Failed to update user ${user.id}:`, updateError);
          throw updateError;
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error(`No user found for Stripe customer ${customerId}`);
          break;
        }

        // Downgrade user to free tier
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: "free",
            subscriptionStatus: "canceled",
            subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`User ${user.id} subscription canceled, downgraded to free tier`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user and update status
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "past_due",
            },
          });
          console.log(`Payment failed for user ${user.id}, marked as past_due`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
