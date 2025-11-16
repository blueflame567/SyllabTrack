import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses } = evt.data;
      const email = email_addresses[0].email_address;

      // Try to find existing user by email (in case they deleted and recreated account)
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // Update existing user's clerkId (they recreated their Clerk account)
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { clerkId: id },
        });
        console.log(`Updated existing user with new clerkId: ${id}`);
      } else {
        // Create new user
        await prisma.user.create({
          data: {
            clerkId: id,
            email,
            subscriptionTier: 'free',
          },
        });
        console.log(`User created: ${id}`);
      }
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses } = evt.data;
      const email = email_addresses[0].email_address;

      // Find user by clerkId
      const user = await prisma.user.findUnique({
        where: { clerkId: id },
      });

      if (user) {
        // Update existing user
        await prisma.user.update({
          where: { id: user.id },
          data: { email },
        });
        console.log(`User updated: ${id}`);
      } else {
        // User doesn't exist yet, create them
        await prisma.user.create({
          data: {
            clerkId: id,
            email,
            subscriptionTier: 'free',
          },
        });
        console.log(`User created (via update event): ${id}`);
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      // Delete user from our database (use deleteMany to avoid errors if user doesn't exist)
      await prisma.user.deleteMany({
        where: { clerkId: id as string },
      });

      console.log(`User deleted: ${id}`);
    }

    return new Response('', { status: 200 });
  } catch (error) {
    console.error(`Error processing webhook event ${eventType}:`, error);
    // Return 200 anyway to prevent Clerk from retrying (we've logged the error)
    return new Response('', { status: 200 });
  }
}
