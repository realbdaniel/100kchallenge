import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using The 100k Challenge ("the Service"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              The 100k Challenge is a gamified platform that helps builders and creators track their journey to making 
              their first $100,000 online. The Service includes progress tracking, social features, achievements, 
              and integration with social media platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">3. User Accounts</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                You must provide accurate and complete information when creating an account. You are responsible for 
                maintaining the confidentiality of your account credentials.
              </p>
              <p>
                You may authenticate using third-party services (such as X/Twitter). You are responsible for maintaining 
                the security of your third-party accounts.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">4. User Content and Conduct</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                You retain ownership of any content you submit to the Service. By submitting content, you grant us 
                a non-exclusive, royalty-free, worldwide license to use, modify, and display your content in connection 
                with the Service.
              </p>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Submit false or misleading information about your progress or earnings</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                <li>Use the Service for any commercial purpose without authorization</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">5. Gamification System</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                The Service includes a gamification system with levels, coins, achievements, and progress tracking. 
                These virtual rewards have no monetary value and cannot be exchanged for real currency.
              </p>
              <p>
                We reserve the right to modify the gamification system, including but not limited to adjusting point 
                values, level requirements, and achievement criteria.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">6. Third-Party Integrations</h2>
            <p className="text-gray-300 leading-relaxed">
              The Service integrates with third-party platforms including X/Twitter. Your use of these integrations 
              is subject to the terms and policies of those third-party services. We are not responsible for the 
              actions or policies of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">7. Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">
                Privacy Policy
              </Link>{' '}
              to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">8. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
              whatsoever, including without limitation if you breach the Terms. You may also terminate your account 
              at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">9. Disclaimers</h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                The Service is provided "as is" and "as available" without any warranties of any kind. We do not 
                guarantee the accuracy, completeness, or usefulness of any information on the Service.
              </p>
              <p>
                The Service is for informational and motivational purposes only. We do not provide financial, 
                investment, or business advice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">10. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall LP Benjamin Daniel, its directors, employees, partners, agents, suppliers, or 
              affiliates be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">11. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes 
              by posting the new Terms on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">12. Contact Information</h2>
            <div className="text-gray-300 leading-relaxed">
              <p>If you have any questions about these Terms, please contact us at:</p>
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