'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Mail,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronRight,
  User,
  Video,
  FileCheck,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contacts', label: 'Contact Submissions', icon: Users },
  { href: '/admin/case-studies', label: 'Case Studies', icon: FileText },
  { href: '/admin/blog', label: 'Blog Posts', icon: BookOpen },
  { href: '/admin/whitepapers', label: 'Whitepapers', icon: FileCheck },
  { href: '/admin/webinars', label: 'Webinars', icon: Video },
  { href: '/admin/subscribers', label: 'Newsletter', icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  // Get user info on mount
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

  // Don't show the admin layout on the login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--aci-secondary)] transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/brand/logo-white.svg"
              alt="ACI Infotech"
              width={120}
              height={30}
              className="h-8 w-auto"
            />
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[var(--aci-primary)] text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 space-y-2">
          {/* User Info */}
          {userEmail && (
            <div className="px-4 py-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <User className="w-4 h-4" />
                <span className="truncate">{userEmail}</span>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span>Back to Site</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
            <Link href="/admin" className="hover:text-[var(--aci-primary)]">
              Admin
            </Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">
                  {navItems.find(item => pathname.startsWith(item.href) && item.href !== '/admin')?.label || 'Page'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
