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

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-sm text-gray-500 italic">
              Last updated: November 17, 2025
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing or using SyllabTrack (&quot;Service,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-700">
                SyllabTrack is an online service that uses artificial intelligence to parse syllabus documents and convert them into structured calendar formats. Our service extracts course information, assignments, due dates, and other academic schedule information from uploaded syllabus files.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Account Creation</h3>
              <p className="text-gray-700">
                To use our Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate and current</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Account Termination</h3>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account at any time if you violate these Terms of Service or engage in fraudulent, abusive, or illegal activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Subscription Plans and Payments</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Free Tier</h3>
              <p className="text-gray-700">
                Our free tier allows limited syllabus parsing per month. Usage limits may be adjusted at our discretion.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Premium Subscription</h3>
              <p className="text-gray-700">
                Premium subscriptions provide unlimited syllabus parsing and are billed monthly at $9.99/month. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Pay all fees associated with your subscription</li>
                <li>Automatic renewal until canceled</li>
                <li>Our use of Stripe as the payment processor</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Refund Policy</h3>
              <p className="text-gray-700">
                All payments are non-refundable except as required by law. You may cancel your subscription at any time, and you will continue to have access until the end of your current billing period.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Price Changes</h3>
              <p className="text-gray-700">
                We reserve the right to change our pricing at any time. We will provide notice of price changes for existing subscribers at least 30 days in advance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Acceptable Use</h2>
              <p className="text-gray-700">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems (bots, scrapers) without permission</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Remove or modify any copyright, trademark, or proprietary notices</li>
                <li>Share your account credentials with others</li>
                <li>Upload content you don&apos;t have the right to use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Your Content</h3>
              <p className="text-gray-700">
                You retain ownership of the syllabus files and content you upload. By uploading content, you grant us a limited license to process and analyze your files to provide the Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Content</h3>
              <p className="text-gray-700">
                The Service, including its design, features, and functionality, is owned by SyllabTrack and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or create derivative works without our permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. AI-Generated Content</h2>
              <p className="text-gray-700">
                Our Service uses AI (Anthropic&apos;s Claude) to parse and extract information from syllabus documents. While we strive for accuracy:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>AI-generated results may contain errors or inaccuracies</li>
                <li>You are responsible for verifying the accuracy of extracted information</li>
                <li>We do not guarantee 100% accuracy of parsed data</li>
                <li>You should review all extracted calendar events before using them</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>The Service will be uninterrupted, secure, or error-free</li>
                <li>The results obtained from the Service will be accurate or reliable</li>
                <li>Any errors in the Service will be corrected</li>
                <li>The Service will meet your specific requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SYLLABTRACK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of your data</li>
                <li>Any errors or inaccuracies in AI-generated content</li>
                <li>Missed assignments or deadlines due to incorrect parsing</li>
                <li>Any other matter relating to the Service</li>
              </ul>
              <p className="text-gray-700 mt-4">
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE LAST 12 MONTHS, OR $100, WHICHEVER IS LESS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless SyllabTrack and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Content you upload to the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Data Privacy</h2>
              <p className="text-gray-700">
                Your use of the Service is also governed by our{" "}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">
                  Privacy Policy
                </Link>
                . Please review it to understand how we collect and use your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Third-Party Services</h2>
              <p className="text-gray-700">
                Our Service integrates with third-party services including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Clerk (authentication)</li>
                <li>Stripe (payment processing)</li>
                <li>Anthropic (AI processing)</li>
                <li>Vercel (hosting)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Your use of these services is subject to their respective terms of service and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by email or through the Service. Your continued use of the Service after changes take effect constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">16. Dispute Resolution</h2>
              <p className="text-gray-700">
                Any dispute arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You agree to waive your right to a jury trial or to participate in a class action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">17. Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">18. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none pl-0 text-gray-700 space-y-2 mt-3">
                <li>Email: <a href="mailto:support@syllabtrack.com" className="text-indigo-600 hover:text-indigo-700">support@syllabtrack.com</a></li>
                <li>Website: <a href="https://www.syllabtrack.com" className="text-indigo-600 hover:text-indigo-700">www.syllabtrack.com</a></li>
              </ul>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> These terms of service are a template and should be reviewed by a qualified attorney to ensure compliance with all applicable laws and regulations before use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
