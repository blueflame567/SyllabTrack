import Link from "next/link";

export const metadata = {
  title: "Terms of Service - SyllabTrack",
  description: "Terms of Service for SyllabTrack",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/"
          className="inline-block mb-8 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            {/*
              PASTE YOUR TERMLY TERMS OF SERVICE HTML HERE

              Instructions:
              1. Go to Termly Dashboard
              2. Click on your Terms of Service
              3. Click "Publish" or "Get Code"
              4. Copy the HTML
              5. Paste it below, replacing this comment
            */}

            <p className="text-gray-600 italic">
              Terms of Service content from Termly will be added here.
            </p>

            {/* Replace the paragraph above with your Termly HTML */}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
