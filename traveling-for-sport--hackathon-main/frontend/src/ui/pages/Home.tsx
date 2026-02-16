import { UpcomingMatchesCarousel } from '@/ui/components/ImageCarousel';
import { PostFeed } from '@/ui/components/PostFeed';
import { TrendingTopics } from '@/ui/components/TrendingTopics';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import { useOutletContext } from 'react-router';
import type { RootContext } from '@/ui/Root';

export function Home() {
  const { isDark } = useOutletContext<RootContext>();

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Upcoming matches carousel banner */}
      <section className="w-full pt-4 pb-2 px-6">
        <UpcomingMatchesCarousel isDark={isDark} />
      </section>

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
