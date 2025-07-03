import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">1. Information We Collect</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Account Information:</strong> Username, email address, and profile information</li>
                <li><strong>Progress Data:</strong> Revenue figures, goals, achievements, and activity logs</li>
                <li><strong>Social Media Data:</strong> Information from connected X/Twitter accounts, including profile information and posts</li>
                <li><strong>Usage Data:</strong> How you interact with our Service, including pages visited and features used</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">2. How We Use Your Information</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide, maintain, and improve our Service</li>
                <li>Create and manage your account</li>
                <li>Track your progress and display achievements</li>
                <li>Enable social features and community interaction</li>
                <li>Send you important updates and notifications</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Analyze usage patterns to improve our Service</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">3. Information Sharing</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Public Profile:</strong> Information you choose to make public (username, progress, achievements) is visible to other users</li>
                <li><strong>Third-Party Services:</strong> With your consent, we share data with connected services like X/Twitter</li>
                <li><strong>Service Providers:</strong> With trusted third parties who help us operate our Service (hosting, analytics, authentication)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="mt-3">
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">4. Third-Party Integrations</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                Our Service integrates with X/Twitter to provide enhanced functionality. When you connect your X/Twitter account:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>We access your basic profile information (username, profile picture, bio)</li>
                <li>We may read your posts to display them within our Service</li>
                <li>We may post on your behalf only with your explicit consent</li>
                <li>Your use of X/Twitter is governed by their privacy policy and terms of service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">5. Data Security</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                We implement appropriate security measures to protect your information, including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure hosting infrastructure</li>
              </ul>
              <p>
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">6. Your Rights and Choices</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Update:</strong> Correct or update your information through your account settings</li>
                <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Withdraw Consent:</strong> Disconnect third-party integrations at any time</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from promotional communications</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">7. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your information for as long as necessary to provide our Service and fulfill our legal obligations. 
              When you delete your account, we will delete your personal information within 30 days, except where we are 
              required to retain it for legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">8. Cookies and Tracking</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Remember your preferences and settings</li>
                <li>Authenticate your account</li>
                <li>Analyze usage patterns</li>
                <li>Improve our Service</li>
              </ul>
              <p>
                You can control cookies through your browser settings, but some features may not work properly if you disable cookies.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">9. International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
              safeguards are in place to protect your information in accordance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">10. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our Service is not intended for children under 13. We do not knowingly collect personal information from 
              children under 13. If we become aware that we have collected such information, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">11. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the Service 
              after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">12. Contact Information</h2>
            <div className="text-gray-300 leading-relaxed">
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
              <div className="mt-2 space-y-1">
                <p>LP Benjamin Daniel</p>
                <p>Email: realbdaniel@gmail.com</p>
                <p>Address: 415 Laurel St. 3105, San Diego, CA 92101</p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-600 text-center text-gray-400">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 