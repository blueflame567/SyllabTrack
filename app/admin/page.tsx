import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./AdminDashboard";
import Link from "next/link";

// Add your Clerk user ID here to grant admin access
// Go to /me to find your Clerk user ID
const ADMIN_USER_IDS = [
  "user_34zYSf1ij9MZPTNzgilbOSriY9E"
  // Example: "user_2abc123def456",
  // Add your Clerk user ID here - visit /me to get it
];

export default async function AdminPage() {
  const authResult = await auth();
  const user = await currentUser();

  if (!authResult.userId) {
    redirect("/");
  }

  // Check if user is admin (SECURE: no fallback for empty array)
  const isAdmin = ADMIN_USER_IDS.includes(authResult.userId);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">You do not have permission to access the admin dashboard.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all users with their usage stats
  const users = await prisma.user.findMany({
    include: {
      usageRecords: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate stats
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const stats = {
    totalUsers: users.length,
    freeUsers: users.filter((u: any) => u.subscriptionTier === "free").length,
    premiumUsers: users.filter((u: any) => u.subscriptionTier === "premium").length,
    totalParses: users.reduce((sum: number, u: any) => sum + u.usageRecords.length, 0),
    parsesThisMonth: users.reduce(
      (sum: number, u: any) =>
        sum +
        u.usageRecords.filter((r: any) => r.month === currentMonth && r.year === currentYear).length,
      0
    ),
  };

  return <AdminDashboard users={users} stats={stats} currentUserEmail={user?.emailAddresses?.[0]?.emailAddress} />;
}
