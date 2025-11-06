import { prisma } from './prisma';

export const FREE_TIER_LIMIT = 3; // 3 syllabi per month for free users

export async function getUserUsageThisMonth(userId: string): Promise<number> {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();

  const count = await prisma.usageRecord.count({
    where: {
      userId,
      month,
      year,
    },
  });

  return count;
}

export async function recordUsage(userId: string): Promise<void> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  await prisma.usageRecord.create({
    data: {
      userId,
      month,
      year,
    },
  });
}

export async function canUserParseSyllabus(userId: string, subscriptionTier: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
}> {
  // Premium users have unlimited access
  if (subscriptionTier === 'premium') {
    return { allowed: true };
  }

  // Free tier users have monthly limits
  const currentUsage = await getUserUsageThisMonth(userId);

  if (currentUsage >= FREE_TIER_LIMIT) {
    return {
      allowed: false,
      reason: `Free tier limit reached. You've used ${currentUsage}/${FREE_TIER_LIMIT} syllabi this month. Upgrade to Premium for unlimited access.`,
      currentUsage,
      limit: FREE_TIER_LIMIT,
    };
  }

  return {
    allowed: true,
    currentUsage,
    limit: FREE_TIER_LIMIT,
  };
}
