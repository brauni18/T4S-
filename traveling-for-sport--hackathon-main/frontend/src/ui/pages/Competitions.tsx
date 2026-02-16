import { useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router';
import { Search, Trophy, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import type { RootContext } from '@/ui/Root';

// ── All competitions, grouped by sport ──────────────────────

interface CompetitionEntry {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  teams: number;
  status: 'Live' | 'Upcoming' | 'Completed';
  startDate: string;
  location: string;
}

interface SportGroup {
  sport: string;
  icon: string;
  competitions: CompetitionEntry[];
}

const SPORT_GROUPS: SportGroup[] = [
  {
    sport: 'Football',
    icon: '⚽',
    competitions: [
      { slug: 'fifa-world-cup-2026', name: 'FIFA World Cup 2026', emoji: '🏆', description: 'The biggest football tournament — USA, Canada & Mexico', teams: 48, status: 'Upcoming', startDate: 'Jun 11, 2026', location: 'USA / Canada / Mexico' },
      { slug: 'premier-league', name: 'Premier League', emoji: '⚽', description: "England's top-tier football league", teams: 20, status: 'Live', startDate: 'Aug 2025', location: 'England' },
      { slug: 'uefa-champions-league', name: 'UEFA Champions League', emoji: '🌟', description: "Europe's premier club competition", teams: 36, status: 'Live', startDate: 'Sep 2025', location: 'Europe' },
      { slug: 'la-liga', name: 'La Liga', emoji: '⚽', description: "Spain's premier football division", teams: 20, status: 'Live', startDate: 'Aug 2025', location: 'Spain' },
      { slug: 'serie-a', name: 'Serie A', emoji: '⚽', description: "Italy's top professional football league", teams: 20, status: 'Live', startDate: 'Aug 2025', location: 'Italy' },
      { slug: 'bundesliga', name: 'Bundesliga', emoji: '⚽', description: "Germany's premier football league", teams: 18, status: 'Live', startDate: 'Aug 2025', location: 'Germany' },
      { slug: 'ligue-1', name: 'Ligue 1', emoji: '⚽', description: "France's top-tier football league", teams: 18, status: 'Live', startDate: 'Aug 2025', location: 'France' },
      { slug: 'mls', name: 'MLS', emoji: '⚽', description: 'Major League Soccer — North America', teams: 29, status: 'Upcoming', startDate: 'Feb 2026', location: 'USA / Canada' },
    ],
  },
  {
    sport: 'Basketball',
    icon: '🏀',
    competitions: [
      { slug: 'nba', name: 'NBA', emoji: '🏀', description: "America's premier basketball league", teams: 30, status: 'Live', startDate: 'Oct 2025', location: 'USA / Canada' },
      { slug: 'euroleague', name: 'EuroLeague', emoji: '🏀', description: "Europe's top professional basketball", teams: 18, status: 'Live', startDate: 'Oct 2025', location: 'Europe' },
    ],
  },
  {
    sport: 'American Football',
    icon: '🏈',
    competitions: [
      { slug: 'nfl', name: 'NFL', emoji: '🏈', description: "National Football League", teams: 32, status: 'Upcoming', startDate: 'Sep 2026', location: 'USA' },
    ],
  },
  {
    sport: 'Baseball',
    icon: '⚾',
    competitions: [
      { slug: 'mlb', name: 'MLB', emoji: '⚾', description: "Major League Baseball", teams: 30, status: 'Upcoming', startDate: 'Mar 2026', location: 'USA / Canada' },
    ],
  },
  {
    sport: 'Hockey',
    icon: '🏒',
    competitions: [
      { slug: 'nhl', name: 'NHL', emoji: '🏒', description: "National Hockey League", teams: 32, status: 'Live', startDate: 'Oct 2025', location: 'USA / Canada' },
    ],
  },
  {
    sport: 'Rugby',
    icon: '🏉',
    competitions: [
      { slug: 'six-nations', name: 'Six Nations', emoji: '🏉', description: 'Annual international rugby union competition', teams: 6, status: 'Upcoming', startDate: 'Feb 2026', location: 'Europe' },
      { slug: 'rugby-world-cup', name: 'Rugby World Cup', emoji: '🏉', description: 'The premier international rugby competition', teams: 20, status: 'Upcoming', startDate: '2027', location: 'Australia' },
    ],
  },
  {
    sport: 'Cricket',
    icon: '🏏',
    competitions: [
      { slug: 'ipl', name: 'IPL', emoji: '🏏', description: 'Indian Premier League — premier T20 cricket', teams: 10, status: 'Upcoming', startDate: 'Mar 2026', location: 'India' },
      { slug: 'cricket-world-cup', name: 'Cricket World Cup', emoji: '🏏', description: 'The premier international cricket competition', teams: 14, status: 'Upcoming', startDate: '2027', location: 'South Africa' },
    ],
  },
];

const ALL_SPORTS = ['All', ...SPORT_GROUPS.map((g) => g.sport)];
const STATUS_FILTERS = ['All', 'Live', 'Upcoming', 'Completed'] as const;

// ── Status badge ────────────────────────────────────────────

function StatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const styles: Record<string, string> = {
    Live: 'bg-red-500/15 text-red-400 border-red-500/30',
    Upcoming: isDark
      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      : 'bg-blue-50 text-blue-600 border-blue-200',
    Completed: isDark
      ? 'bg-gray-500/15 text-gray-400 border-gray-500/30'
      : 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {status === 'Live' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />}
      {status}
    </span>
  );
}

// ── Page ────────────────────────────────────────────────────

export function Competitions() {
  const { isDark } = useOutletContext<RootContext>();
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SPORT_GROUPS
      .filter((g) => sportFilter === 'All' || g.sport === sportFilter)
      .map((g) => ({
        ...g,
        competitions: g.competitions.filter((c) => {
          const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
          const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
          return matchesSearch && matchesStatus;
        }),
      }))
      .filter((g) => g.competitions.length > 0);
  }, [search, sportFilter, statusFilter]);

  const totalCount = filtered.reduce((s, g) => s + g.competitions.length, 0);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[240px] shrink-0">
          <div className="sticky top-20">
            <SportsSidebar isDark={isDark} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <Trophy className={`size-6 ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`} />
              <h1 className="text-2xl font-extrabold tracking-tight">Competitions</h1>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Browse {totalCount} leagues & tournaments across {SPORT_GROUPS.length} sports
            </p>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div
              className={`flex items-center flex-1 max-w-sm rounded-xl border px-3 py-2 transition-colors ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <Search className={`size-4 mr-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search competitions..."
                className={`bg-transparent border-none outline-none text-sm w-full ${
                  isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Sport pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_SPORTS.map((s) => (
              <button
                key={s}
                onClick={() => setSportFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  sportFilter === s
                    ? 'bg-[#22c55e] text-black'
                    : isDark
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? isDark
                      ? 'bg-white/15 text-white'
                      : 'bg-gray-900 text-white'
                    : isDark
                      ? 'bg-white/5 text-gray-500 hover:bg-white/10'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Groups */}
          {filtered.length === 0 ? (
            <div className={`text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Trophy className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No competitions found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="space-y-10">
              {filtered.map((group) => (
                <section key={group.sport}>
                  <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                    <span className="text-xl">{group.icon}</span>
                    {group.sport}
                    <span className={`text-xs font-normal ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      ({group.competitions.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {group.competitions.map((comp) => (
                      <Link
                        key={comp.slug}
                        to={`/competition/${comp.slug}`}
                        className={`group rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:scale-[1.01] ${
                          isDark
                            ? 'bg-[#1a1a1a] border-white/5 hover:border-[#22c55e]/30 hover:bg-[#1a1a1a]/80'
                            : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{comp.emoji}</span>
                            <div>
                              <h3 className="font-bold text-sm leading-tight group-hover:text-[#22c55e] transition-colors">
                                {comp.name}
                              </h3>
                              <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {comp.description}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={comp.status} isDark={isDark} />
                        </div>

                        <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {comp.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {comp.startDate}
                          </span>
                          <span>{comp.teams} teams</span>
                        </div>

                        <div className="flex items-center justify-end mt-auto">
                          <span className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                            isDark ? 'text-gray-500 group-hover:text-[#22c55e]' : 'text-gray-400 group-hover:text-green-600'
                          }`}>
                            View competition
                            <ArrowRight className="size-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
