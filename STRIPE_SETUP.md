# Stripe Integration Setup Guide

This guide will walk you through setting up Stripe payments for your Syllibus app.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Your app running locally or deployed

## Step 1: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to your `.env.local` file:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## Step 2: Create a Product and Price in Stripe

1. Go to https://dashboard.stripe.com/test/products
2. Click **"Add product"**
3. Fill in the details:
   - **Name**: Syllibus Premium
   - **Description**: Unlimited syllabus parsing
   - **Pricing**:
     - **One time** or **Recurring** → Select **Recurring**
     - **Billing period** → Select **Monthly**
     - **Price** → Enter **9.99** (or your preferred price)
     - **Currency** → Select **USD**
4. Click **"Save product"**
5. After saving, you'll see a **Price ID** (starts with `price_`)
6. Copy this Price ID and add it to your `.env.local`:

```env
STRIPE_MONTHLY_PRICE_ID=price_1234567890abcdef
```

### Optional: Create a Yearly Price

If you want to offer yearly subscriptions:
1. Go back to your product
2. Click **"Add another price"**
3. Set billing period to **Yearly** and price to **99.99** (or your preferred price)
4. Copy the yearly Price ID and add it to `.env.local`:

```env
STRIPE_YEARLY_PRICE_ID=price_yearly_1234567890abcdef
```

Then update `lib/stripe.ts` to use these price IDs.

## Step 3: Set Up Stripe Webhooks

Webhooks allow Stripe to notify your app when subscriptions are created, updated, or canceled.

### For Local Development (Using Stripe CLI)

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli#install
2. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```
3. **Forward webhooks to your local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. This will output a webhook signing secret (starts with `whsec_`)
5. Copy it and add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```
6. Keep the Stripe CLI running while testing

### For Production (After Deployment)

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** and add it to your production environment variables

## Step 4: Update Environment Variables

Your `.env.local` should now have:

```env
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-...

# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Update Price IDs in Code

Open `app/pricing/PricingClient.tsx` and update the `handleSubscribe` function call:

Replace:
```typescript
handleSubscribe("price_monthly_placeholder")
```

With your actual Stripe Price ID:
```typescript
handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "price_1234567890abcdef")
```

Or better yet, pass it as a prop from the server component.

## Step 6: Test the Integration

1. **Start your dev server**: `npm run dev`
2. **Start Stripe CLI** (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. **Sign in to your app**
4. **Go to `/pricing`**
5. **Click "Upgrade to Premium"**
6. **Use Stripe test card**: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
7. **Complete checkout**
8. **Verify**:
   - You're redirected to `/success`
   - Check your Stripe dashboard for the new subscription
   - Check your database - user should have `subscriptionTier: "premium"`
   - Try parsing more than 3 syllabi (should work!)

## Step 7: Handle Edge Cases

### Customer Portal (for users to manage subscriptions)

Users will need a way to cancel or update their subscription. Add this API route:

**`app/api/stripe/create-portal-session/route.ts`**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const authResult = await auth();
  if (!authResult.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: authResult.userId },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/`,
  });

  return NextResponse.json({ url: session.url });
}
```

Then add a "Manage Subscription" button on your pricing page for premium users.

## Troubleshooting

### Webhook Not Working
- Make sure Stripe CLI is running
- Check webhook secret matches in `.env.local`
- Look at server console logs for errors
- Check Stripe dashboard → Developers → Webhooks → Events for failed events

### Payment Not Processing
- Check Stripe dashboard → Payments for errors
- Verify Price ID is correct in code
- Make sure `STRIPE_SECRET_KEY` is set correctly

### User Not Upgraded After Payment
- Check database - is `stripeCustomerId` and `stripeSubscriptionId` set?
- Check webhook events in Stripe dashboard
- Look for `checkout.session.completed` event
- Verify webhook handler is receiving and processing events correctly

## Moving to Production

1. Switch from test keys to live keys in Stripe dashboard
2. Update all environment variables with live keys
3. Set up production webhook endpoint in Stripe dashboard
4. Test with real payment (you can refund it after testing)
5. Monitor Stripe dashboard for any issues

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Test Cards: https://stripe.com/docs/testing
- Stripe CLI: https://stripe.com/docs/stripe-cli
