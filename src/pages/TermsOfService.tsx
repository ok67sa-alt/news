import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Scale, Shield } from 'lucide-react';
import SeoTags from '../components/SeoTags';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoTags 
        title="Terms of Service | Sudan News" 
        description="Terms and conditions for using Sudan News website and services. User responsibilities, content guidelines, and legal agreements."
      />

      {/* Header */}
      <div className="border-b-4 border-brand-dark pb-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-8 w-8 text-brand-red" />
          <h1 className="font-headline font-black text-4xl sm:text-5xl text-brand-dark uppercase tracking-tight">
            Terms of Service
          </h1>
        </div>
        <p className="text-sm text-brand-muted font-body">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Introduction */}
      <div className="prose prose-sm max-w-none mb-12">
        <p className="text-brand-muted leading-relaxed font-body">
          Welcome to Sudan News. By accessing or using our website, you agree to be bound by these Terms of Service. 
          Please read them carefully before using our services. If you do not agree with any part of these terms, 
          you must not use our website.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        
        {/* Acceptance of Terms */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Scale className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Acceptance of Terms
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              By accessing Sudan News, you confirm that you are at least 13 years old and have the legal capacity 
              to enter into these Terms of Service. If you are using our services on behalf of an organization, 
              you represent that you have the authority to bind that organization to these terms.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our website after changes 
              constitutes acceptance of the modified terms.
            </p>
          </div>
        </section>

        {/* Use of Services */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Use of Services
            </h2>
          </div>
          
          <div className="space-y-4 text-sm text-brand-muted font-body leading-relaxed">
            <div>
              <h3 className="font-bold text-brand-dark mb-2">Permitted Use</h3>
              <p>You may use Sudan News to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Read news articles and reports</li>
                <li>Subscribe to our newsletter</li>
                <li>Share articles on social media</li>
                <li>Access archived content</li>
                <li>Browse categories and search for topics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-brand-dark mb-2">Prohibited Use</h3>
              <p>You must not:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Copy, reproduce, or redistribute our content for commercial purposes without permission</li>
                <li>Use automated systems (bots, scrapers) to access our website excessively</li>
                <li>Attempt to gain unauthorized access to our systems or user accounts</li>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Impersonate Sudan News staff or other users</li>
                <li>Use our services for any illegal activities</li>
                <li>Interfere with the proper functioning of our website</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Content and Intellectual Property */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Content and Intellectual Property
            </h2>
          </div>
          
          <div className="space-y-4 text-sm text-brand-muted font-body leading-relaxed">
            <div>
              <h3 className="font-bold text-brand-dark mb-2">Our Content</h3>
              <p>
                All content on Sudan News, including articles, images, videos, logos, and design, is owned by 
                Sudan News or our content providers and is protected by international copyright laws.
              </p>
              <p className="mt-2">
                You may share and link to our articles with proper attribution. For commercial use, licensing, 
                or republication rights, please contact us.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-brand-dark mb-2">Fair Use</h3>
              <p>Brief excerpts may be quoted for:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>News reporting and commentary</li>
                <li>Academic research and education</li>
                <li>Non-commercial personal use</li>
              </ul>
              <p className="mt-2">
                All quotes must include proper attribution and a link back to the original article.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-brand-dark mb-2">User Submissions</h3>
              <p>
                If you submit content to us (comments, tips, photos), you grant Sudan News a non-exclusive, 
                royalty-free, worldwide license to use, reproduce, and publish that content.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Disclaimers
            </h2>
          </div>
          
          <div className="space-y-4 text-sm text-brand-muted font-body leading-relaxed">
            <div>
              <h3 className="font-bold text-brand-dark mb-2">Accuracy of Information</h3>
              <p>
                While we strive for accuracy, Sudan News does not guarantee that all information on our website 
                is complete, accurate, or current. News content is provided "as is" without warranties of any kind.
              </p>
              <p className="mt-2">
                We reserve the right to correct errors, update information, and make editorial changes at any time.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-brand-dark mb-2">External Links</h3>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the content, 
                accuracy, or practices of external sites. Accessing third-party links is at your own risk.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-brand-dark mb-2">No Professional Advice</h3>
              <p>
                Sudan News provides general information and news reporting. Our content should not be considered 
                legal, financial, medical, or professional advice. Consult qualified professionals for specific guidance.
              </p>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Scale className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Limitation of Liability
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              To the fullest extent permitted by law, Sudan News, its staff, contributors, and affiliates shall not be 
              liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Your use or inability to use our website</li>
              <li>Errors, omissions, or inaccuracies in our content</li>
              <li>Unauthorized access to our servers or databases</li>
              <li>Loss of data or business interruption</li>
              <li>Actions taken based on information from our website</li>
            </ul>
            <p className="mt-4">
              This limitation applies even if we have been advised of the possibility of such damages.
            </p>
          </div>
        </section>

        {/* User Conduct */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              User Conduct and Community Standards
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>We expect all users to maintain respectful and responsible behavior. Prohibited conduct includes:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Harassment or threats:</strong> Threatening, abusing, or harassing other users or our staff</li>
              <li><strong>Hate speech:</strong> Content promoting violence or discrimination based on race, ethnicity, religion, gender, or other protected characteristics</li>
              <li><strong>Misinformation:</strong> Deliberately spreading false or misleading information</li>
              <li><strong>Spam:</strong> Posting repetitive, promotional, or irrelevant content</li>
              <li><strong>Privacy violations:</strong> Sharing others' personal information without consent</li>
            </ul>
            <p className="mt-4">
              We reserve the right to remove content and suspend or ban users who violate these standards.
            </p>
          </div>
        </section>

        {/* Account Security */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Account Security
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              If you create an account or subscribe to our newsletter, you are responsible for maintaining the 
              confidentiality of your login credentials.
            </p>
            <p>
              You must notify us immediately of any unauthorized access or security breach. We are not liable for 
              losses arising from unauthorized use of your account.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Termination
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              We reserve the right to suspend or terminate your access to Sudan News at our sole discretion, 
              without notice, for conduct that we believe:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Violates these Terms of Service</li>
              <li>Violates applicable laws or regulations</li>
              <li>Harms or threatens other users or our operations</li>
              <li>Exposes us to legal liability</li>
            </ul>
          </div>
        </section>

        {/* Governing Law */}
        <section className="border-l-4 border-brand-red pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <Scale className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Governing Law and Disputes
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              These Terms of Service are governed by the laws of Sudan. Any disputes arising from these terms or 
              your use of our website shall be resolved in the courts of Khartoum, Sudan.
            </p>
            <p>
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions 
              shall remain in full force and effect.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="border-l-4 border-brand-blue pl-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-brand-blue" />
            <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase">
              Changes to These Terms
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-brand-muted font-body leading-relaxed">
            <p>
              We may update these Terms of Service from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors.
            </p>
            <p>
              Material changes will be posted on this page with an updated "Last Updated" date. Your continued 
              use of Sudan News after changes constitutes acceptance of the revised terms.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-brand-bgMuted border border-brand-border p-6 rounded">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-brand-red" />
            <h2 className="font-headline font-bold text-xl text-brand-dark uppercase">
              Contact Us
            </h2>
          </div>
          
          <div className="space-y-2 text-sm text-brand-muted font-body leading-relaxed">
            <p>If you have questions about these Terms of Service, please contact us:</p>
            <div className="mt-4 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:legal@sudannews.com" className="text-brand-red hover:underline">legal@sudannews.com</a></p>
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
