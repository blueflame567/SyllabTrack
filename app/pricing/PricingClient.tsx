"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PricingClientProps {
  currentTier: string;
  monthlyPriceId: string;
}

export default function PricingClient({ currentTier, monthlyPriceId }: PricingClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading("portal");
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to open billing portal");
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Unlock unlimited syllabus parsing with Premium
          </p>
          <a
            href="/"
            className="inline-block mt-4 text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Home
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <div className="text-gray-600">per month</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">3 syllabi per month</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">PDF & DOCX support</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">Calendar export (.ics)</span>
              </li>
            </ul>

            {currentTier === "free" ? (
              <button
                disabled
                className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={handleManageSubscription}
                disabled={loading !== null}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading === "portal" ? "Loading..." : "Cancel Subscription"}
              </button>
            )}
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-xl p-8 border-2 border-indigo-600 transform scale-105">
            <div className="text-center mb-6">
              <div className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-full mb-4">
                MOST POPULAR
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Premium</h2>
              <div className="text-4xl font-bold text-white mb-2">$9.99</div>
              <div className="text-indigo-100">per month</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-yellow-400 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-white font-semibold">Unlimited syllabi</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-yellow-400 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-white">PDF & DOCX support</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-yellow-400 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-white">Calendar export (.ics)</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-yellow-400 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-white">Priority support</span>
              </li>
            </ul>

            {currentTier === "premium" ? (
              <button
                onClick={handleManageSubscription}
                disabled={loading !== null}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-white text-indigo-600 hover:bg-gray-50 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading === "portal" ? "Loading..." : "Manage Subscription"}
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(monthlyPriceId)}
                disabled={loading !== null}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-white text-indigo-600 hover:bg-gray-50 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading === monthlyPriceId ? "Loading..." : "Upgrade to Premium"}
              </button>
            )}
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why upgrade to Premium?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have more than 3 classes or want to import syllabi for the entire semester
            without limits, Premium gives you unlimited access to parse as many syllabi as you
            need.
          </p>
          <p className="text-gray-600">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
