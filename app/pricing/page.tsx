import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PricingClient from "./PricingClient";
import Link from "next/link";

export default async function PricingPage() {
  const authResult = await auth();

  if (!authResult.userId) {
    redirect("/");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: authResult.userId },
  });

  const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!monthlyPriceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">
            Stripe pricing is not configured. Please add <code className="bg-gray-100 px-2 py-1 rounded">STRIPE_MONTHLY_PRICE_ID</code> to your environment variables.
          </p>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
            <li>Go to <a href="https://dashboard.stripe.com/test/products" target="_blank" className="text-indigo-600 hover:underline">Stripe Products</a></li>
            <li>Create a new product with monthly pricing</li>
            <li>Copy the Price ID (starts with price_)</li>
            <li>Add it to .env.local as STRIPE_MONTHLY_PRICE_ID</li>
          </ol>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <PricingClient currentTier={user?.subscriptionTier || "free"} monthlyPriceId={monthlyPriceId} />;
}
