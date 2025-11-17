// Script to manually upgrade user to premium
// Run with: npx tsx scripts/fix-user-tier.ts USER_ID

import { prisma } from '../lib/prisma';

async function fixUserTier(userId: string) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: 'premium',
      },
    });

    console.log('✅ User upgraded to premium!');
    console.log('User ID:', updated.id);
    console.log('Email:', updated.email);
    console.log('New Tier:', updated.subscriptionTier);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const userId = process.argv[2];
if (!userId) {
  console.error('Please provide a user ID as argument');
  console.log('Usage: npx tsx scripts/fix-user-tier.ts USER_ID');
  process.exit(1);
}

fixUserTier(userId);
