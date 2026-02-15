import { ImageCarousel } from '@/ui/components/ImageCarousel';
import { PostFeed } from '@/ui/components/PostFeed';
// import { TrendingMatches } from '@/ui/components/TrendingMatches';
import { TrendingTopics } from '@/ui/components/TrendingTopics';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function Home() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Theme toggle - top right */}
      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
            isDark
              ? 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {isDark ? 'Light' : 'Dark'}
        </button>
      </div>

      {/* Image carousel banner */}
      <section className="w-full pt-2 pb-2 px-6">
        <ImageCarousel isDark={isDark} />
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
              {/* <TrendingMatches isDark={isDark} /> */}
              <TrendingTopics isDark={isDark} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
