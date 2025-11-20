import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
              SyllabTrack
            </Link>
            <p className="text-sm text-gray-400 mt-1">
              Transform your syllabus into a calendar
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <Link
              href="/privacy"
              className="text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <a
              href="mailto:support@syllabtrack.com"
              className="text-sm hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SyllabTrack. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Build: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString().substring(0, 19)}
          </p>
        </div>
      </div>
    </footer>
  );
}
