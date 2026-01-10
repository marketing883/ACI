'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Menu,
  X,
  LogOut,
  ChevronRight,
  User,
  Video,
  FileCheck,
  MessageSquare,
  Bell,
  Search,
  Settings,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Mail,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type NavItem =
  | { href: string; label: string; icon: typeof LayoutDashboard; description?: string }
  | { label: string; icon: typeof LayoutDashboard; children: { href: string; label: string; icon: typeof LayoutDashboard }[] };

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & analytics' },
  {
    label: 'Leads',
    icon: Users,
    children: [
      { href: '/admin/contacts', label: 'Contact Submissions', icon: FileText },
      { href: '/admin/chat-leads', label: 'Chat Leads', icon: MessageSquare },
      { href: '/admin/playbook-leads', label: 'Playbook Leads', icon: BookOpen },
      { href: '/admin/whitepaper-leads', label: 'Whitepaper Leads', icon: FileCheck },
      { href: '/admin/subscribers', label: 'Newsletter Subscribers', icon: Mail },
    ]
  },
  {
    label: 'Content',
    icon: FileText,
    children: [
      { href: '/admin/case-studies', label: 'Case Studies', icon: FileText },
      { href: '/admin/blog', label: 'Blog Posts', icon: BookOpen },
      { href: '/admin/whitepapers', label: 'Whitepapers', icon: FileCheck },
      { href: '/admin/webinars', label: 'Webinars', icon: Video },
    ]
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Leads', 'Content']);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const getUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      }
    };
    if (!isLoginPage) {
      getUser();
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label)
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

  const isActiveLink = (href: string) => {
    if (href === '/admin') return pathname === href;
    return pathname.startsWith(href);
  };

  const getCurrentPageTitle = () => {
    for (const item of navItems) {
      if ('href' in item && item.href && isActiveLink(item.href)) {
        return item.label;
      }
      if ('children' in item && item.children) {
        for (const child of item.children) {
          if (isActiveLink(child.href)) {
            return child.label;
          }
        }
      }
    }
    return 'Admin';
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] overflow-x-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200/80 transform transition-transform lg:translate-x-0 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">ACI Admin</span>
            </div>
          </Link>
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if ('href' in item) {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                </Link>
              );
            }

            // Section with children
            const Icon = item.icon;
            const isExpanded = expandedSections.includes(item.label);
            const hasActiveChild = item.children?.some(child => isActiveLink(child.href));

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleSection(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    hasActiveChild
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${hasActiveChild ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isActive = isActiveLink(child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <ChildIcon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className="text-sm">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 p-4 space-y-2">
          {/* User Info Card */}
          {userEmail && (
            <div className="px-4 py-3 bg-gray-50 rounded-xl mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-sm font-medium">Back to Website</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700 transition-colors">
                Admin
              </Link>
              {pathname !== '/admin' && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-900 font-semibold">{getCurrentPageTitle()}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search...</span>
              <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs text-gray-400 bg-white rounded border border-gray-200">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Help */}
            <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Profile Avatar - Desktop */}
            <div className="hidden lg:flex items-center gap-3 pl-3 ml-2 border-l border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>© 2024 ACI Infotech. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
