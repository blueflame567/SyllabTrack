import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Add your Clerk user ID here to grant admin access
// This MUST match the ADMIN_USER_IDS in app/admin/page.tsx
// Go to /me to find your Clerk user ID
const ADMIN_USER_IDS = [
  "user_35XYQliCMfqfBZJw8IJnFPBL1cv",
];

export async function POST(request: NextRequest) {
  try {
    const authResult = await auth();

    if (!authResult.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin (SECURE: no fallback for empty array)
    const isAdmin = ADMIN_USER_IDS.includes(authResult.userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { userId, tier } = await request.json();

    if (!userId || !tier) {
      return NextResponse.json(
        { error: "Missing userId or tier" },
        { status: 400 }
      );
    }

    if (tier !== "free" && tier !== "premium") {
      return NextResponse.json(
        { error: "Invalid tier. Must be 'free' or 'premium'" },
        { status: 400 }
      );
    }

    // Update user tier
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        updatedAt: new Date(),
      },
    });

    console.log(`Admin ${authResult.userId} updated user ${userId} to ${tier} tier`);

    return NextResponse.json({
      success: true,
      tier: updatedUser.subscriptionTier,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("Error updating user tier:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user tier" },
      { status: 500 }
    );
  }
}
