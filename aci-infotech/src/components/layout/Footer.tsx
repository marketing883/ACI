'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter, Youtube, Mail, Phone } from 'lucide-react';
import NewsletterForm from '@/components/forms/NewsletterForm';

const FOOTER_LINKS = {
  services: [
    { label: 'Data Engineering', href: '/services/data-engineering' },
    { label: 'Applied AI & ML', href: '/services/applied-ai-ml' },
    { label: 'Cloud Modernization', href: '/services/cloud-modernization' },
    { label: 'MarTech & CDP', href: '/services/martech-cdp' },
  ],
  resources: [
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Playbooks', href: '/playbooks' },
    { label: 'Blog', href: '/blog' },
    { label: 'Whitepapers', href: '/whitepapers' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
};

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aciinfotech', icon: Linkedin },
  { label: 'Twitter', href: 'https://twitter.com/aciinfotech', icon: Twitter },
  { label: 'YouTube', href: 'https://www.youtube.com/@aciinfotech', icon: Youtube },
];

const CERTIFICATIONS = [
  { name: 'Great Place to Work', image: '/images/certifications-awards/best-place-to-work.webp' },
  { name: 'ISO 27001:2022', image: '/images/certifications-awards/iso-27001.webp' },
  { name: 'CMMi Level 3', image: '/images/certifications-awards/cmmi.webp' },
  { name: '5 Best Data Analytics', image: '/images/certifications-awards/best-data-analytics-company.webp' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--aci-secondary)] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Column 1: Logo & About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/aci-infotech-logo-white.png"
                alt="ACI Infotech"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Accelerating enterprise transformation through AI, data, and cloud innovation.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Stay Connected</h3>

            {/* Newsletter Form */}
            <div className="mb-6">
              <p className="text-white/80 text-sm mb-3">
                Get insights on enterprise technology delivered to your inbox.
              </p>
              <NewsletterForm
                variant="stacked"
                placeholder="Your email"
                buttonText="Subscribe"
              />
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-[6px] flex items-center justify-center hover:bg-[#0052CC] transition-all duration-200 hover:-translate-y-0.5"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="tel:+17324167900"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                <span>+1 (732) 416-7900</span>
              </a>
              <a
                href="mailto:info@aciinfotech.com"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span>info@aciinfotech.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Badges */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="text-white/60 text-sm">Certified & Trusted:</span>
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.name}
                className="relative h-12 w-24"
                title={cert.name}
              >
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/60 text-sm">
              &copy; {currentYear} ACI Infotech. All Rights Reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/privacy-policy"
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
