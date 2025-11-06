"use client";

import { useState } from "react";

interface MeClientProps {
  userId: string;
  email: string;
}

export default function MeClient({ userId, email }: MeClientProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your User Information</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Clerk User ID:</label>
            <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 font-mono text-sm break-all">
              {userId}
            </div>
            <button
              onClick={copyToClipboard}
              className="mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
            >
              {copied ? "✓ Copied!" : "Copy to Clipboard"}
            </button>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Email:</label>
            <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
              {email}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">To Secure Admin Access:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
              <li>Copy your Clerk User ID above</li>
              <li>
                Open <code className="bg-blue-100 px-1 rounded">app/admin/page.tsx</code>
              </li>
              <li>
                Add your ID to the <code className="bg-blue-100 px-1 rounded">ADMIN_USER_IDS</code> array:
                <pre className="mt-2 p-2 bg-blue-100 rounded text-xs overflow-x-auto">
{`const ADMIN_USER_IDS = [
  "${userId}",
];`}
                </pre>
              </li>
              <li>
                Do the same in <code className="bg-blue-100 px-1 rounded">app/api/admin/update-tier/route.ts</code>
              </li>
              <li>
                Remove the <code className="bg-blue-100 px-1 rounded">|| ADMIN_USER_IDS.length === 0</code> fallback from both files
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <a
            href="/admin"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Go to Admin Dashboard
          </a>
          <a
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
