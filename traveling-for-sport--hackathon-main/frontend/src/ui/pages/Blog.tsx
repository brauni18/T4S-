import { useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router';
import { Search, Clock, BookOpen } from 'lucide-react';
import type { RootContext } from '@/ui/Root';
import {
  COMPETITION_BLOG,
  COMPETITION_MAP,
  TAG_STYLES,
  type BlogArticle,
} from '@/ui/pages/Competition';

// Flatten every competition's blog articles into one list, enriched with the
// competition slug + name so we can display / filter by competition.
interface EnrichedArticle extends BlogArticle {
  competitionSlug: string;
  competitionName: string;
}

const ALL_ARTICLES: EnrichedArticle[] = Object.entries(COMPETITION_BLOG)
  .flatMap(([slug, articles]) =>
    articles.map((a) => ({
      ...a,
      competitionSlug: slug,
      competitionName: COMPETITION_MAP[slug]?.name ?? slug,
    })),
  )
  // newest first
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const ALL_TAGS = ['all', ...Array.from(new Set(ALL_ARTICLES.map((a) => a.tag)))] as const;
const ALL_COMPETITIONS = [
  'all',
  ...Array.from(new Set(ALL_ARTICLES.map((a) => a.competitionSlug))),
] as const;

export function Blog() {
  const { isDark } = useOutletContext<RootContext>();

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [activeComp, setActiveComp] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_ARTICLES.filter((a) => {
      if (activeTag !== 'all' && a.tag !== activeTag) return false;
      if (activeComp !== 'all' && a.competitionSlug !== activeComp) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.excerpt.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [search, activeTag, activeComp]);

  const pill = (
    label: string,
    value: string,
    current: string,
    onClick: (v: string) => void,
  ) => (
    <button
      key={value}
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
        current === value
          ? 'bg-[#22c55e] text-black'
          : isDark
            ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`min-h-screen transition-colors ${isDark ? 'bg-[#0f0f0f] text-[#e0e0e0]' : 'bg-gray-50 text-gray-800'}`}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className={`size-7 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Blog
          </h1>
          <span className={`ml-auto text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {filtered.length} article{filtered.length !== 1 && 's'}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#22c55e] transition-colors ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
          />
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {ALL_TAGS.map((t) => {
            const label =
              t === 'all'
                ? 'All'
                : TAG_STYLES[t as keyof typeof TAG_STYLES]?.label ?? t;
            return pill(label, t, activeTag, setActiveTag);
          })}
        </div>

        {/* Competition pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_COMPETITIONS.map((c) =>
            pill(
              c === 'all' ? 'All Competitions' : COMPETITION_MAP[c]?.name ?? c,
              c,
              activeComp,
              setActiveComp,
            ),
          )}
        </div>

        {/* Articles grid */}
        {filtered.length === 0 ? (
          <p className={`text-center py-16 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No articles match your filters.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => {
              const tagStyle = TAG_STYLES[article.tag];
              return (
                <Link
                  key={article.id}
                  to={`/competition/${article.competitionSlug}?tab=blog`}
                  className={`group flex flex-col rounded-xl border overflow-hidden transition-colors ${
                    isDark
                      ? 'border-white/10 bg-[#1a1a1a] hover:border-[#22c55e]/40'
                      : 'border-gray-200 bg-white hover:border-[#22c55e]/60 shadow-sm'
                  }`}
                >
                  {/* Image placeholder */}
                  <div
                    className={`flex items-center justify-center h-32 text-4xl ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}
                  >
                    {article.image}
                  </div>

                  <div className="flex flex-col flex-1 p-4 gap-2">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${isDark ? tagStyle.dark : tagStyle.light}`}
                      >
                        {tagStyle.label}
                      </span>
                      <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>
                        {article.competitionName}
                      </span>
                    </div>

                    <h3
                      className={`font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#22c55e] transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {article.title}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {article.excerpt}
                    </p>

                    <div
                      className={`mt-auto pt-2 flex items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      <span>{article.author}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {article.readTime}
                      </span>
                      <span className="ml-auto">{article.date}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
