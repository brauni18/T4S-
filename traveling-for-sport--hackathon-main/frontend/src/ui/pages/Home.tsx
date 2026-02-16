import { UpcomingMatchesCarousel } from '@/ui/components/ImageCarousel';
import { PostFeed } from '@/ui/components/PostFeed';
import { TrendingTopics } from '@/ui/components/TrendingTopics';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import { useOutletContext } from 'react-router';
import { Newspaper, Swords, Trophy } from 'lucide-react';
import type { RootContext } from '@/ui/Root';
import { Link } from 'react-router';

export function Home() {
  const { isDark } = useOutletContext<RootContext>();

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Upcoming matches carousel banner */}
      <section className="w-full pt-4 pb-2 px-6">
        <UpcomingMatchesCarousel isDark={isDark} />
      </section>

      {/* Tab navigation */}
      <div className="max-w-[1400px] mx-auto px-6 pt-4">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#22c55e] text-black shadow-md shadow-[#22c55e]/20"
          >
            <Newspaper className="size-4" />
            Feed
          </button>
          <Link
            to="/competitions"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              isDark
                ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                : 'bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Trophy className="size-4" />
            Competitions
          </Link>
          <Link
            to="/teams"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              isDark
                ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                : 'bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Swords className="size-4" />
            Teams
          </Link>
        </div>
      </div>

      {/* Main content: 3-column Reddit-style layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
          {/* Left sidebar - Sports categories */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <SportsSidebar isDark={isDark} />
            </div>
          </aside>

          {/* Center - Post feed */}
          <main className="min-w-0">
            <PostFeed isDark={isDark} />
          </main>

          {/* Right sidebar - Trending matches + Topics */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <TrendingTopics isDark={isDark} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
