'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import NewsletterForm from '@/components/forms/NewsletterForm';

const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Leadership Team', href: '/about#leadership' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
  ],
  services: [
    { label: 'Data Engineering', href: '/services/data-engineering' },
    { label: 'Applied AI & ML', href: '/services/applied-ai-ml' },
    { label: 'Cloud Modernization', href: '/services/cloud-modernization' },
    { label: 'MarTech & CDP', href: '/services/martech-cdp' },
    { label: 'Digital Transformation', href: '/services/digital-transformation' },
    { label: 'Cyber Security', href: '/services/cyber-security' },
  ],
  resources: [
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'Whitepapers', href: '/resources/whitepapers' },
    { label: 'Webinars', href: '/resources/webinars' },
  ],
};

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aciinfotech', icon: Linkedin },
  { label: 'Twitter', href: 'https://twitter.com/aciinfotech', icon: Twitter },
  { label: 'YouTube', href: 'https://www.youtube.com/@aciinfotech', icon: Youtube },
];

const CERTIFICATIONS = [
  { name: 'ISO 27001', image: '/images/certifications/iso27001.png' },
  { name: 'CMMi Level 3', image: '/images/certifications/cmmi.png' },
  { name: 'Great Place to Work', image: '/images/certifications/gptw.png' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--aci-secondary)] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Connected</h3>

            {/* Newsletter Form */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3">
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
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-[var(--aci-primary)] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="tel:+17324167900"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+1 (732) 416-7900</span>
              </a>
              <a
                href="mailto:info@aciinfotech.com"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@aciinfotech.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Badges */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="text-gray-500 text-sm">Certified & Trusted:</span>
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.name}
                className="h-12 w-24 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400"
                title={cert.name}
              >
                {/* Placeholder for certification images */}
                {cert.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} ACI Infotech. All Rights Reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/privacy-policy"
                className="text-gray-500 text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-500 text-sm hover:text-white transition-colors"
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
