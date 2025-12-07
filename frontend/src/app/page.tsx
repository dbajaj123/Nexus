import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, TrendingUp, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Nexus</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Nexus</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            The revolutionary AI-driven school operating system with gamification and wellness tracking
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
              <p className="text-gray-600">
                AI-powered assignments, auto-grading, and personalized study assistance
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gamification</h3>
              <p className="text-gray-600">
                Earn XP, unlock badges, and compete on leaderboards
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Wallet className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Digital Wallet</h3>
              <p className="text-gray-600">
                Manage payments, transactions, and school finances seamlessly
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2025 Nexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
