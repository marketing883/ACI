import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ACI Infotech',
  description: 'Terms of Service for ACI Infotech - Terms and conditions governing use of our website and services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[var(--aci-secondary)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-blue-100">Last updated: January 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              Welcome to ACI Infotech. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website located at aciinfotech.com (the &quot;Website&quot;) and any services, content, or resources made available through the Website (collectively, the &quot;Services&quot;).
            </p>
            <p className="text-gray-600 mb-4">
              By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Services.
            </p>
            <p className="text-gray-600">
              ACI Infotech reserves the right to modify these Terms at any time. We will notify users of any material changes by updating the &quot;Last updated&quot; date. Your continued use of the Services after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Description</h2>
            <p className="text-gray-600 mb-4">
              ACI Infotech is an enterprise technology consulting company providing professional services including, but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Data Engineering and Analytics solutions</li>
              <li>Artificial Intelligence and Machine Learning implementations</li>
              <li>Cloud Modernization and Infrastructure services</li>
              <li>Marketing Technology and Customer Data Platform solutions</li>
              <li>Digital Transformation consulting</li>
              <li>Cyber Security advisory services</li>
            </ul>
            <p className="text-gray-600 mt-4">
              The Website provides information about our services, resources such as whitepapers and playbooks, blog content, case studies, and functionality to contact us or request consultations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Services</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Eligibility</h3>
            <p className="text-gray-600 mb-4">
              You must be at least 18 years old and have the legal capacity to enter into binding contracts to use our Services. By using our Services, you represent and warrant that you meet these requirements.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Permitted Use</h3>
            <p className="text-gray-600 mb-4">You agree to use the Services only for lawful purposes and in accordance with these Terms. You may:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Browse and access publicly available content on the Website</li>
              <li>Download resources made available for download</li>
              <li>Submit inquiries and contact forms</li>
              <li>Subscribe to newsletters and communications</li>
              <li>Engage with our chat assistant for information purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Activities</h3>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use the Services for any unlawful purpose or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to any portion of the Services or related systems</li>
              <li>Interfere with or disrupt the Services or servers connected to the Services</li>
              <li>Use automated systems (bots, scrapers) to access the Services without permission</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Collect or harvest information about other users without consent</li>
              <li>Use the Services to compete with ACI Infotech or for competitive analysis without permission</li>
              <li>Reproduce, duplicate, copy, sell, or resell any portion of the Services without express written permission</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ownership</h3>
            <p className="text-gray-600 mb-4">
              The Services and all content, features, and functionality (including but not limited to text, graphics, logos, images, videos, software, and design) are owned by ACI Infotech, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Trademarks</h3>
            <p className="text-gray-600 mb-4">
              &quot;ACI Infotech,&quot; &quot;ArqAI,&quot; the ACI logo, and all related names, logos, product and service names, designs, and slogans are trademarks of ACI Infotech or its affiliates. You may not use such marks without the prior written permission of ACI Infotech.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Limited License</h3>
            <p className="text-gray-600">
              Subject to your compliance with these Terms, ACI Infotech grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your personal or internal business purposes. This license does not include the right to modify, reproduce, distribute, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any content except as expressly permitted.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Submissions</h2>
            <p className="text-gray-600 mb-4">
              You may have the opportunity to submit information, inquiries, feedback, or other content through the Services (&quot;User Submissions&quot;). By submitting User Submissions, you grant ACI Infotech a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your User Submissions for the purpose of providing and improving our Services.
            </p>
            <p className="text-gray-600">
              You represent and warrant that you own or have the necessary rights to submit User Submissions and that they do not violate any third-party rights or applicable laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Services</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Separate Agreements</h3>
            <p className="text-gray-600 mb-4">
              Professional consulting services provided by ACI Infotech are subject to separate service agreements, statements of work, or master service agreements negotiated between ACI Infotech and the client. These Terms govern use of the Website and do not constitute an agreement for professional services.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Professional Advice</h3>
            <p className="text-gray-600">
              Information provided on the Website, including blog posts, whitepapers, playbooks, and chat interactions, is for general informational purposes only and does not constitute professional advice. You should consult with qualified professionals before making business decisions based on such information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links and Services</h2>
            <p className="text-gray-600 mb-4">
              The Services may contain links to third-party websites, services, or resources that are not owned or controlled by ACI Infotech. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-gray-600">
              You acknowledge and agree that ACI Infotech shall not be responsible or liable for any damage or loss caused or alleged to be caused by or in connection with the use of any such third-party websites or services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. ACI INFOTECH DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT</li>
              <li>WARRANTIES THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS</li>
              <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY INFORMATION PROVIDED</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ACI INFOTECH, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Your access to or use of (or inability to access or use) the Services</li>
              <li>Any conduct or content of any third party on the Services</li>
              <li>Any content obtained from the Services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            <p className="text-gray-600 mt-4">
              IN NO EVENT SHALL ACI INFOTECH&apos;S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF THE SERVICES EXCEED THE AMOUNT YOU PAID TO ACI INFOTECH, IF ANY, FOR ACCESSING THE SERVICES DURING THE TWELVE (12) MONTHS PRIOR TO THE CLAIM.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-600">
              You agree to defend, indemnify, and hold harmless ACI Infotech and its officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms or your use of the Services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Dispute Resolution</h2>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of New Jersey, United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600">
              Any dispute arising out of or relating to these Terms or the Services shall be resolved exclusively in the state or federal courts located in New Jersey, and you consent to the personal jurisdiction of such courts.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-600">
              ACI Infotech may terminate or suspend your access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Services will immediately cease.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
            <p className="text-gray-600">
              If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid, illegal, or unenforceable provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable while preserving its original intent.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Entire Agreement</h2>
            <p className="text-gray-600">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and ACI Infotech regarding your use of the Services and supersede all prior agreements, understandings, and communications, whether written or oral.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-800 font-semibold mb-2">ACI Infotech</p>
              <p className="text-gray-600">Email: <a href="mailto:legal@aciinfotech.com" className="text-[var(--aci-primary)] hover:underline">legal@aciinfotech.com</a></p>
              <p className="text-gray-600">Phone: +1 (732) 416-7900</p>
              <p className="text-gray-600">Website: <a href="https://aciinfotech.com" className="text-[var(--aci-primary)] hover:underline">aciinfotech.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
