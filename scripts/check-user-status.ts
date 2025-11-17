// Quick script to check user status in database
// Run with: npx tsx scripts/check-user-status.ts YOUR_CLERK_ID

import { prisma } from '../lib/prisma';

async function checkUser(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        usageRecords: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      console.log('❌ User not found with clerkId:', clerkId);
      return;
    }

    console.log('\n📊 User Status:');
    console.log('================');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Clerk ID:', user.clerkId);
    console.log('Subscription Tier:', user.subscriptionTier);
    console.log('Subscription Status:', user.subscriptionStatus || 'N/A');
    console.log('Stripe Customer ID:', user.stripeCustomerId || 'N/A');
    console.log('Stripe Subscription ID:', user.stripeSubscriptionId || 'N/A');
    console.log('Subscription Ends At:', user.subscriptionEndsAt || 'N/A');
    console.log('Created At:', user.createdAt);
    console.log('\n📈 Recent Usage:');
    console.log('================');
    user.usageRecords.forEach((record, i) => {
      console.log(`${i + 1}. ${record.createdAt.toISOString()} - Month: ${record.month}/${record.year}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const clerkId = process.argv[2];
if (!clerkId) {
  console.error('Please provide a Clerk ID as argument');
  console.log('Usage: npx tsx scripts/check-user-status.ts YOUR_CLERK_ID');
  process.exit(1);
}

checkUser(clerkId);
