import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
      </div>

      <div className="space-y-8 text-slate-300 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p>
            When you use ContextAI, we collect information that you provide directly to us, such as your name, email address (via Google Sign-In), and the content you generate using our tools. We also automatically collect analytics data (via Google Analytics) such as page views and device types to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve ContextAI. Your generated content is saved securely in our database so you can access your history. We do not sell your personal information or content to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Third-Party Services</h2>
          <p>
            We use third-party services like Firebase (for authentication and database), Google Analytics (for usage tracking), and Groq (for AI content generation). These services have their own privacy policies regarding how they handle data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via the Feedback form on our homepage.
          </p>
        </section>
      </div>
    </div>
  );
}
