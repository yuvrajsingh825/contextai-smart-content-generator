import React from 'react';
import { Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
      </div>

      <div className="space-y-8 text-slate-300 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using ContextAI, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Use of Service</h2>
          <p>
            ContextAI provides an AI-powered content generation tool. You agree to use this service only for lawful purposes. You are solely responsible for the content you generate and how you choose to use or publish it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Intellectual Property</h2>
          <p>
            The ContextAI platform, its design, and code are owned by us. However, you retain all rights to the specific content you generate using our AI tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. "As Is" Service</h2>
          <p>
            ContextAI is provided "as is" without any warranties, expressed or implied. We do not guarantee that the generated content will be 100% accurate, error-free, or suitable for your specific needs. Please review all AI-generated content before publishing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. Continued use of the platform after any changes constitute your acceptance of the new Terms.
          </p>
        </section>
      </div>
    </div>
  );
}
