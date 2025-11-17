import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - SyllabTrack",
  description: "Privacy Policy for SyllabTrack",
};

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-sm text-gray-500 italic">
              Last updated: November 17, 2025
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to SyllabTrack ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at syllabtrack.com.
              </p>
              <p className="text-gray-700 mt-4">
                By using SyllabTrack, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
              <p className="text-gray-700">We collect information that you provide directly to us when you:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Create an account (name, email address, password)</li>
                <li>Make a purchase (billing information, processed securely through Stripe)</li>
                <li>Upload syllabus documents for processing</li>
                <li>Contact us for support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Syllabus Data</h3>
              <p className="text-gray-700">
                When you upload syllabus files, we temporarily process the content to extract course information, assignments, and due dates. This may include educational content, course names, instructor names, and academic schedules.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-700">We automatically collect certain information when you use our services:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your syllabus files using AI to extract calendar information</li>
                <li>Process payments and maintain billing records</li>
                <li>Send you service-related notifications and updates</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Monitor usage patterns and analyze trends to improve user experience</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. How We Share Your Information</h2>
              <p className="text-gray-700">We do not sell your personal information. We may share your information with:</p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Service Providers</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li><strong>Clerk:</strong> Authentication and user management</li>
                <li><strong>Stripe:</strong> Payment processing (they have their own privacy policy)</li>
                <li><strong>Anthropic:</strong> AI-powered syllabus parsing (Claude API)</li>
                <li><strong>Vercel:</strong> Hosting and infrastructure</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Legal Requirements</h3>
              <p className="text-gray-700">
                We may disclose your information if required by law, court order, or legal process, or to protect the rights, property, or safety of SyllabTrack, our users, or others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Uploaded syllabus files are processed temporarily and stored securely. You can delete your account and associated data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Privacy Rights</h2>
              <p className="text-gray-700">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:support@syllabtrack.com" className="text-indigo-600 hover:text-indigo-700">
                  support@syllabtrack.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-700">
                Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none pl-0 text-gray-700 space-y-2 mt-3">
                <li>Email: <a href="mailto:support@syllabtrack.com" className="text-indigo-600 hover:text-indigo-700">support@syllabtrack.com</a></li>
                <li>Website: <a href="https://www.syllabtrack.com" className="text-indigo-600 hover:text-indigo-700">www.syllabtrack.com</a></li>
              </ul>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This privacy policy is a template and should be reviewed by a qualified attorney to ensure compliance with all applicable laws and regulations before use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
