import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Mail, Globe } from 'lucide-react';
import SeoTags from '../components/SeoTags';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoTags 
        title="Privacy Policy | Sudan News" 
        description="Learn how Sudan News collects, uses, and protects your personal information. Our commitment to your privacy and data security."
      />

      {/* Header */}
      <div className="border-b-4 border-brand-dark pb-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-brand-red" />
          <h1 className="font-headline font-black text-4xl sm:text-5xl text-brand-dark uppercase tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="text-sm text-brand-muted font-body">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Introduction */}
      <div className="prose prose-sm max-w-none mb-12">
        <p className="text-brand-muted leading-relaxed font-body">
          At Sudan News, we are committed to protecting your privacy and ensuring the security of your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
          and use our services.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        
        {/* Information We Collect */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Information We Collect
            </h2>
          </div>
          
          <div className="space-y-4 text-sm text-brand-muted font-body leading-relaxed">
            <div>
              <h3 className="font-bold text-brand-dark mb-2">Personal Information</h3>
              <p>When you subscribe to our newsletter or contact us, we may collect:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Email address</li>
                <li>Name (if provided)</li>
                <li>Any information you voluntarily provide in communications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-brand-dark mb-2">Automatically Collected Information</h3>
              <p>When you visit our website, we automatically collect:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Article views and interactions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              How We Use Your Information
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Provide and improve our services:</strong> Deliver news content, personalize your experience, and enhance website functionality</li>
              <li><strong>Send newsletters:</strong> Deliver daily news updates if you've subscribed</li>
              <li><strong>Analyze usage:</strong> Understand how visitors use our site to improve content and user experience</li>
              <li><strong>Respond to inquiries:</strong> Answer questions and provide customer support</li>
              <li><strong>Comply with legal obligations:</strong> Meet legal requirements and protect our rights</li>
            </ul>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Cookies and Tracking Technologies
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Track article views and popular content</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Improve website performance</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Data Security
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Secure server infrastructure</li>
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Regular security audits</li>
              <li>Limited access to personal data</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, 
              we cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Third-Party Services
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.</p>
            <p>We may use third-party services for:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Analytics (Google Analytics or similar)</li>
              <li>Email delivery (newsletter services)</li>
              <li>Content delivery networks (CDN)</li>
              <li>Social media integration</li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Your Rights
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data portability:</strong> Receive your data in a structured format</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at: <a href="mailto:privacy@sudannews.com" className="text-brand-red hover:underline">privacy@sudannews.com</a>
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Children's Privacy
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              Our services are not directed to children under 13 years of age. We do not knowingly collect personal information 
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </div>
        </section>

        {/* Changes to This Policy */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Changes to This Policy
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated 
              "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </div>
        </section>

        {/* Contact Us */}
        <section className="bg-brand-bgMuted border border-brand-border p-6 rounded">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-xl text-brand-dark uppercase">
              Contact Us
            </h2>
          </div>
          
          <div className="space-y-2 text-sm text-brand-muted font-body leading-relaxed">
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-4 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:privacy@sudannews.com" className="text-brand-red hover:underline">privacy@sudannews.com</a></p>
              <p><strong>Address:</strong> Sudan News, Khartoum, Sudan</p>
              <p><strong>Facebook:</strong> <a href="https://www.facebook.com/share/18bTgrtnqB/" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Sudan News Official Page</a></p>
            </div>
          </div>
        </section>

      </div>

      {/* Back to Home */}
      <div className="mt-12 pt-8 border-t border-brand-border text-center">
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-dark text-white font-ui font-bold text-xs uppercase tracking-wider transition-all duration-200"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
