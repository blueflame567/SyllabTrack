"use client";

import FileUpload from "./components/FileUpload";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function Home() {
  useEffect(() => {
    track("page_view", { page: "home" });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-gray-900">SyllabTrack</div>
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/library"
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                onClick={() => track("nav_click", { to: "library", from: "home" })}
              >
                Library
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                onClick={() => track("nav_click", { to: "pricing", from: "home" })}
              >
                Pricing
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  onClick={() => track("auth_button_clicked", { action: "signin", location: "home" })}
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  onClick={() => track("auth_button_clicked", { action: "signup", location: "home" })}
                >
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Transform Your Syllabus
          </h1>
          <p className="text-xl text-gray-600">
            Upload and convert to calendar in seconds
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <FileUpload />
        </div>
      </div>
    </main>
  );
}
