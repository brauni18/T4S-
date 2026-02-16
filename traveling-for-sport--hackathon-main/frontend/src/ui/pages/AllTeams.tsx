import { useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router';
import { Search, Users, MapPin, ArrowRight } from 'lucide-react';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import { SPORT_TEAMS } from '@/ui/pages/Teams';
import type { RootContext } from '@/ui/Root';

const ALL_SPORTS = ['All', ...SPORT_TEAMS.map((s) => s.label)];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AllTeams() {
  const { isDark } = useOutletContext<RootContext>();
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Collect available categories for current sport filter
  const availableCategories = useMemo(() => {
    const sports = sportFilter === 'All' ? SPORT_TEAMS : SPORT_TEAMS.filter((s) => s.label === sportFilter);
    const cats = new Set<string>();
    sports.forEach((s) => s.teams.forEach((t) => cats.add(t.category)));
    return ['All', ...Array.from(cats).sort()];
  }, [sportFilter]);

  // Reset category when sport changes
  const effectiveCategory = availableCategories.includes(categoryFilter) ? categoryFilter : 'All';

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SPORT_TEAMS
      .filter((s) => sportFilter === 'All' || s.label === sportFilter)
      .map((s) => ({
        ...s,
        teams: s.teams.filter((t) => {
          const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.stadium.toLowerCase().includes(q);
          const matchesCat = effectiveCategory === 'All' || t.category === effectiveCategory;
          return matchesSearch && matchesCat;
        }),
      }))
      .filter((s) => s.teams.length > 0);
  }, [search, sportFilter, effectiveCategory]);

  const totalCount = filtered.reduce((s, g) => s + g.teams.length, 0);

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
              <Users className={`size-6 ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`} />
              <h1 className="text-2xl font-extrabold tracking-tight">Teams</h1>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Browse {totalCount} teams across {SPORT_TEAMS.length} sports
            </p>
          </div>

          {/* Search */}
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
                placeholder="Search teams, cities, stadiums..."
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
                onClick={() => {
                  setSportFilter(s);
                  setCategoryFilter('All');
                }}
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

          {/* Category pills */}
          {availableCategories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {availableCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    effectiveCategory === c
                      ? isDark
                        ? 'bg-white/15 text-white'
                        : 'bg-gray-900 text-white'
                      : isDark
                        ? 'bg-white/5 text-gray-500 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Groups */}
          {filtered.length === 0 ? (
            <div className={`text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Users className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No teams found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="space-y-10">
              {filtered.map((sport) => (
                <section key={sport.slug}>
                  <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                    <span className="text-xl">{sport.icon}</span>
                    {sport.label}
                    <span className={`text-xs font-normal ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      ({sport.teams.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sport.teams.map((team) => (
                      <Link
                        key={team.name}
                        to={`/teams/${sport.slug}/${slugify(team.name)}`}
                        className={`group rounded-2xl border p-4 flex items-start gap-4 transition-all hover:scale-[1.01] ${
                          isDark
                            ? 'bg-[#1a1a1a] border-white/5 hover:border-[#22c55e]/30 hover:bg-[#1a1a1a]/80'
                            : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <span className="text-3xl shrink-0">{team.badge}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm leading-tight group-hover:text-[#22c55e] transition-colors truncate">
                            {team.name}
                          </h3>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {team.category}
                          </p>
                          <div className={`flex items-center gap-3 mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {team.city}
                            </span>
                            <span>Est. {team.founded}</span>
                          </div>
                          <p className={`text-[11px] mt-1 truncate ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            {team.stadium}
                          </p>
                        </div>
                        <ArrowRight className={`size-4 mt-1 shrink-0 transition-colors ${
                          isDark ? 'text-gray-700 group-hover:text-[#22c55e]' : 'text-gray-300 group-hover:text-green-600'
                        }`} />
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
