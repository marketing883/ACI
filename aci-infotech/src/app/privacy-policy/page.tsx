import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ACI Infotech',
  description: 'Privacy Policy for ACI Infotech - How we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[var(--aci-secondary)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-4">
              ACI Infotech (&quot;ACI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website at aciinfotech.com, use our services, or engage with us in any other way.
            </p>
            <p className="text-gray-600">
              By accessing or using our services, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
            <p className="text-gray-600 mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Fill out contact forms or request information about our services</li>
              <li>Subscribe to our newsletter or marketing communications</li>
              <li>Download whitepapers, playbooks, or other resources</li>
              <li>Register for webinars or events</li>
              <li>Apply for employment opportunities</li>
              <li>Engage with our chat assistant</li>
              <li>Communicate with us via email, phone, or other channels</li>
            </ul>
            <p className="text-gray-600 mb-4">This information may include:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Name, email address, phone number, and company name</li>
              <li>Job title and professional information</li>
              <li>Location and time zone preferences</li>
              <li>Service interests and project requirements</li>
              <li>Communications and correspondence with us</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-600 mb-4">When you visit our website, we automatically collect certain information, including:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Device and browser information (type, version, operating system)</li>
              <li>IP address and geographic location data</li>
              <li>Pages visited, time spent on pages, and navigation patterns</li>
              <li>Referring website or source</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Service Delivery:</strong> To respond to your inquiries, provide consultations, and deliver our professional services</li>
              <li><strong>Communication:</strong> To send you relevant information about our services, industry insights, and updates</li>
              <li><strong>Marketing:</strong> To send newsletters, promotional materials, and information about events (with your consent)</li>
              <li><strong>Website Improvement:</strong> To analyze usage patterns and improve our website functionality and user experience</li>
              <li><strong>Lead Intelligence:</strong> To better understand your needs and provide personalized service recommendations</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party vendors who assist us in operating our website, conducting business, or servicing you (e.g., hosting providers, email services, analytics tools)</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of all or a portion of our assets</li>
              <li><strong>Legal Requirements:</strong> When required by law, legal process, or government request</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or that of our clients or others</li>
              <li><strong>With Your Consent:</strong> In any other circumstances where you have provided explicit consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to collect information about your browsing activities. Cookies are small data files stored on your device that help us improve our website and your experience.
            </p>
            <p className="text-gray-600 mb-4">Types of cookies we use:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics)</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-gray-600 mt-4">
              You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security assessments and audits</li>
              <li>Employee training on data protection practices</li>
              <li>ISO 27001:2022 certified information security management</li>
            </ul>
            <p className="text-gray-600 mt-4">
              While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600">
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements. When personal information is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-600 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@aciinfotech.com" className="text-[var(--aci-primary)] hover:underline">privacy@aciinfotech.com</a>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="text-gray-600">
              Our website may contain links to third-party websites or services that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-600">
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-600">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take appropriate safeguards to ensure that your personal information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on this page with a new &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-800 font-semibold mb-2">ACI Infotech</p>
              <p className="text-gray-600">Email: <a href="mailto:privacy@aciinfotech.com" className="text-[var(--aci-primary)] hover:underline">privacy@aciinfotech.com</a></p>
              <p className="text-gray-600">Phone: +1 (732) 416-7900</p>
              <p className="text-gray-600">Website: <a href="https://aciinfotech.com" className="text-[var(--aci-primary)] hover:underline">aciinfotech.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
