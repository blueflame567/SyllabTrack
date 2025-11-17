// Quick script to check if customer exists in database
// Run with: npx tsx scripts/check-customer.ts CUSTOMER_ID

import { prisma } from '../lib/prisma';

async function checkCustomer(customerId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.log('❌ No user found with stripeCustomerId:', customerId);

      // Check all users to see their customer IDs
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          stripeCustomerId: true,
          subscriptionTier: true,
        },
      });

      console.log('\n📋 All users in database:');
      allUsers.forEach(u => {
        console.log(`- ${u.email}: stripeCustomerId=${u.stripeCustomerId || 'null'}, tier=${u.subscriptionTier}`);
      });
      return;
    }

    console.log('✅ User found!');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Stripe Customer ID:', user.stripeCustomerId);
    console.log('Subscription Tier:', user.subscriptionTier);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const customerId = process.argv[2];
if (!customerId) {
  console.error('Please provide a Stripe customer ID as argument');
  console.log('Usage: npx tsx scripts/check-customer.ts cus_xxxxx');
  process.exit(1);
}

checkCustomer(customerId);
