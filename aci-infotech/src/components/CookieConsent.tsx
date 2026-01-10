'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield } from 'lucide-react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'aci_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

type ConsentChoice = 'accepted' | 'declined' | 'essential-only' | null;

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: true,
    marketing: false,
  } as CookiePreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (choice: ConsentChoice, prefs?: CookiePreferences) => {
    const consentData = {
      choice,
      preferences: prefs || preferences,
      timestamp: new Date().toISOString(),
      expiry: new Date(Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);

    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', {
      detail: consentData
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    setPreferences(allAccepted);
    saveConsent('accepted', allAccepted);
  };

  const handleDeclineNonEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    setPreferences(essentialOnly);
    saveConsent('essential-only', essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent('accepted', { ...preferences, timestamp: new Date().toISOString() });
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Main Banner */}
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-[#0052CC]/10 rounded-full flex-shrink-0">
                  <Cookie className="w-6 h-6 text-[#0052CC]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We use cookies to enhance your browsing experience, provide personalized content,
                    and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                    You can manage your preferences or learn more in our{' '}
                    <Link href="/privacy" className="text-[#0052CC] hover:underline">
                      Privacy Policy
                    </Link>.
                  </p>

                  {/* Cookie Details (Expandable) */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-200 pt-4 mt-2 space-y-4">
                          {/* Essential Cookies */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Essential Cookies</p>
                                <p className="text-xs text-gray-500">Required for the website to function properly</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-400 mr-2">Always on</span>
                              <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-not-allowed">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                              </div>
                            </div>
                          </div>

                          {/* Analytics Cookies */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Analytics Cookies</p>
                              <p className="text-xs text-gray-500">Help us understand how visitors interact with our site</p>
                            </div>
                            <button
                              onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                              className={`w-10 h-6 rounded-full relative transition-colors ${
                                preferences.analytics ? 'bg-[#0052CC]' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  preferences.analytics ? 'right-1' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Marketing Cookies */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Marketing Cookies</p>
                              <p className="text-xs text-gray-500">Used to deliver personalized advertisements</p>
                            </div>
                            <button
                              onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                              className={`w-10 h-6 rounded-full relative transition-colors ${
                                preferences.marketing ? 'bg-[#0052CC]' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  preferences.marketing ? 'right-1' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button
                      onClick={handleAcceptAll}
                      className="px-5 py-2.5 bg-[#0052CC] text-white text-sm font-medium rounded-lg hover:bg-[#003D99] transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleDeclineNonEssential}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Essential Only
                    </button>
                    {showDetails ? (
                      <button
                        onClick={handleSavePreferences}
                        className="px-5 py-2.5 border border-[#0052CC] text-[#0052CC] text-sm font-medium rounded-lg hover:bg-[#0052CC]/5 transition-colors"
                      >
                        Save Preferences
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowDetails(true)}
                        className="px-5 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
                      >
                        Customize
                      </button>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleDeclineNonEssential}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close cookie banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <Link href="/privacy" className="hover:text-[#0052CC] transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="hover:text-[#0052CC] transition-colors">
                    Terms of Service
                  </Link>
                </div>
                <p>GDPR &amp; CCPA Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper function to check cookie consent status (for use in other components)
export function getCookieConsent(): { choice: ConsentChoice; preferences: CookiePreferences } | null {
  if (typeof window === 'undefined') return null;

  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!consent) return null;

  try {
    const parsed = JSON.parse(consent);
    // Check if consent has expired
    if (new Date(parsed.expiry) < new Date()) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Helper to check if specific cookie type is allowed
export function isCookieAllowed(type: 'analytics' | 'marketing'): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent.preferences[type] ?? false;
}
