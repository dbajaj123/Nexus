'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Bell, MessageSquare, Sun } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar, isFocusModeEnabled, toggleFocusMode } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated() || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Nexus
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleFocusMode}>
              <Sun className={`h-5 w-5 ${isFocusModeEnabled ? 'text-orange-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center space-x-2 ml-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {user.profile.firstName} {user.profile.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  Level {user.profile.level} • {user.profile.xp} XP
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 bg-white border-r min-h-[calc(100vh-57px)] p-4">
            <nav className="space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/courses">
                <Button variant="ghost" className="w-full justify-start">
                  Courses
                </Button>
              </Link>
              <Link href="/dashboard/assignments">
                <Button variant="ghost" className="w-full justify-start">
                  Assignments
                </Button>
              </Link>
              <Link href="/dashboard/wellness">
                <Button variant="ghost" className="w-full justify-start">
                  Wellness
                </Button>
              </Link>
              <Link href="/dashboard/wallet">
                <Button variant="ghost" className="w-full justify-start">
                  Wallet
                </Button>
              </Link>
              <Link href="/dashboard/leaderboard">
                <Button variant="ghost" className="w-full justify-start">
                  Leaderboard
                </Button>
              </Link>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
