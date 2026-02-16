import { useParams, Link, useOutletContext } from 'react-router';
import { useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Users, LayoutGrid, Layers, Search } from 'lucide-react';
import type { RootContext } from '@/ui/Root';

// ── Team data with extra info for cards ─────────────────────

interface TeamCard {
  name: string;
  badge: string;
  city: string;
  stadium: string;
  founded: number;
  category: string;
}

interface SportData {
  label: string;
  icon: string;
  slug: string;
  teams: TeamCard[];
}

const SPORT_TEAMS: SportData[] = [
  {
    label: 'Football (Soccer)',
    icon: '⚽',
    slug: 'football',
    teams: [
      { name: 'Real Madrid', badge: '⚪', city: 'Madrid, Spain', stadium: 'Santiago Bernabéu', founded: 1902, category: 'European Giants' },
      { name: 'Barcelona', badge: '🔵', city: 'Barcelona, Spain', stadium: 'Spotify Camp Nou', founded: 1899, category: 'European Giants' },
      { name: 'Manchester City', badge: '🔵', city: 'Manchester, England', stadium: 'Etihad Stadium', founded: 1880, category: 'Premier League Elite' },
      { name: 'Arsenal', badge: '🔴', city: 'London, England', stadium: 'Emirates Stadium', founded: 1886, category: 'Premier League Elite' },
      { name: 'Liverpool', badge: '🔴', city: 'Liverpool, England', stadium: 'Anfield', founded: 1892, category: 'Premier League Elite' },
      { name: 'Chelsea', badge: '🔵', city: 'London, England', stadium: 'Stamford Bridge', founded: 1905, category: 'Premier League Elite' },
      { name: 'Bayern Munich', badge: '🔴', city: 'Munich, Germany', stadium: 'Allianz Arena', founded: 1900, category: 'European Giants' },
      { name: 'PSG', badge: '🔵', city: 'Paris, France', stadium: 'Parc des Princes', founded: 1970, category: 'European Giants' },
      { name: 'Inter Miami', badge: '🩷', city: 'Fort Lauderdale, USA', stadium: 'Chase Stadium', founded: 2018, category: 'MLS Rising Stars' },
      { name: 'Juventus', badge: '⚪', city: 'Turin, Italy', stadium: 'Allianz Stadium', founded: 1897, category: 'Serie A Powerhouses' },
      { name: 'Inter Milan', badge: '🔵', city: 'Milan, Italy', stadium: 'San Siro', founded: 1908, category: 'Serie A Powerhouses' },
      { name: 'AC Milan', badge: '🔴', city: 'Milan, Italy', stadium: 'San Siro', founded: 1899, category: 'Serie A Powerhouses' },
      { name: 'Napoli', badge: '🔵', city: 'Naples, Italy', stadium: 'Stadio Diego Maradona', founded: 1926, category: 'Serie A Powerhouses' },
      { name: 'Borussia Dortmund', badge: '🟡', city: 'Dortmund, Germany', stadium: 'Signal Iduna Park', founded: 1909, category: 'Fan Favorites' },
      { name: 'Atlético Madrid', badge: '🔴', city: 'Madrid, Spain', stadium: 'Cívitas Metropolitano', founded: 1903, category: 'La Liga Contenders' },
      { name: 'Tottenham', badge: '⚪', city: 'London, England', stadium: 'Tottenham Hotspur Stadium', founded: 1882, category: 'Premier League Elite' },
      { name: 'LAFC', badge: '⚫', city: 'Los Angeles, USA', stadium: 'BMO Stadium', founded: 2014, category: 'MLS Rising Stars' },
      { name: 'Seattle Sounders', badge: '🟢', city: 'Seattle, USA', stadium: 'Lumen Field', founded: 2007, category: 'MLS Rising Stars' },
      { name: 'Bayer Leverkusen', badge: '🔴', city: 'Leverkusen, Germany', stadium: 'BayArena', founded: 1904, category: 'Fan Favorites' },
      { name: 'Benfica', badge: '🔴', city: 'Lisbon, Portugal', stadium: 'Estádio da Luz', founded: 1904, category: 'Fan Favorites' },
    ],
  },
  {
    label: 'Basketball',
    icon: '🏀',
    slug: 'basketball',
    teams: [
      { name: 'Los Angeles Lakers', badge: '🟡', city: 'Los Angeles, CA', stadium: 'Crypto.com Arena', founded: 1947, category: 'Western Conference' },
      { name: 'Boston Celtics', badge: '🟢', city: 'Boston, MA', stadium: 'TD Garden', founded: 1946, category: 'Eastern Conference' },
      { name: 'Golden State Warriors', badge: '🔵', city: 'San Francisco, CA', stadium: 'Chase Center', founded: 1946, category: 'Western Conference' },
      { name: 'Denver Nuggets', badge: '🔵', city: 'Denver, CO', stadium: 'Ball Arena', founded: 1967, category: 'Western Conference' },
      { name: 'Milwaukee Bucks', badge: '🟢', city: 'Milwaukee, WI', stadium: 'Fiserv Forum', founded: 1968, category: 'Eastern Conference' },
      { name: 'Miami Heat', badge: '🔴', city: 'Miami, FL', stadium: 'Kaseya Center', founded: 1988, category: 'Eastern Conference' },
      { name: 'Philadelphia 76ers', badge: '🔵', city: 'Philadelphia, PA', stadium: 'Wells Fargo Center', founded: 1946, category: 'Eastern Conference' },
      { name: 'Dallas Mavericks', badge: '🔵', city: 'Dallas, TX', stadium: 'American Airlines Center', founded: 1980, category: 'Western Conference' },
      { name: 'New York Knicks', badge: '🔵', city: 'New York, NY', stadium: 'Madison Square Garden', founded: 1946, category: 'Historic Franchises' },
      { name: 'Chicago Bulls', badge: '🔴', city: 'Chicago, IL', stadium: 'United Center', founded: 1966, category: 'Historic Franchises' },
      { name: 'San Antonio Spurs', badge: '⚫', city: 'San Antonio, TX', stadium: 'Frost Bank Center', founded: 1967, category: 'Historic Franchises' },
      { name: 'Phoenix Suns', badge: '🟠', city: 'Phoenix, AZ', stadium: 'Footprint Center', founded: 1968, category: 'Western Conference' },
    ],
  },
  {
    label: 'American Football',
    icon: '🏈',
    slug: 'american-football',
    teams: [
      { name: 'Kansas City Chiefs', badge: '🔴', city: 'Kansas City, MO', stadium: 'GEHA Field at Arrowhead', founded: 1960, category: 'AFC Contenders' },
      { name: 'Philadelphia Eagles', badge: '🟢', city: 'Philadelphia, PA', stadium: 'Lincoln Financial Field', founded: 1933, category: 'NFC Contenders' },
      { name: 'San Francisco 49ers', badge: '🔴', city: 'Santa Clara, CA', stadium: "Levi's Stadium", founded: 1946, category: 'NFC Contenders' },
      { name: 'Dallas Cowboys', badge: '🔵', city: 'Arlington, TX', stadium: 'AT&T Stadium', founded: 1960, category: 'NFC Contenders' },
      { name: 'Buffalo Bills', badge: '🔵', city: 'Orchard Park, NY', stadium: 'Highmark Stadium', founded: 1960, category: 'AFC Contenders' },
      { name: 'Baltimore Ravens', badge: '🟣', city: 'Baltimore, MD', stadium: 'M&T Bank Stadium', founded: 1996, category: 'AFC Contenders' },
      { name: 'Detroit Lions', badge: '🔵', city: 'Detroit, MI', stadium: 'Ford Field', founded: 1930, category: 'NFC Contenders' },
      { name: 'Green Bay Packers', badge: '🟢', city: 'Green Bay, WI', stadium: 'Lambeau Field', founded: 1919, category: 'Legacy Teams' },
      { name: 'New England Patriots', badge: '🔴', city: 'Foxborough, MA', stadium: 'Gillette Stadium', founded: 1959, category: 'Legacy Teams' },
      { name: 'Pittsburgh Steelers', badge: '🟡', city: 'Pittsburgh, PA', stadium: 'Acrisure Stadium', founded: 1933, category: 'Legacy Teams' },
    ],
  },
  {
    label: 'Baseball',
    icon: '⚾',
    slug: 'baseball',
    teams: [
      { name: 'New York Yankees', badge: '🔵', city: 'Bronx, NY', stadium: 'Yankee Stadium', founded: 1901, category: 'AL Powerhouses' },
      { name: 'Los Angeles Dodgers', badge: '🔵', city: 'Los Angeles, CA', stadium: 'Dodger Stadium', founded: 1883, category: 'NL Powerhouses' },
      { name: 'Boston Red Sox', badge: '🔴', city: 'Boston, MA', stadium: 'Fenway Park', founded: 1901, category: 'AL Powerhouses' },
      { name: 'Houston Astros', badge: '🟠', city: 'Houston, TX', stadium: 'Minute Maid Park', founded: 1962, category: 'AL Powerhouses' },
      { name: 'Atlanta Braves', badge: '🔴', city: 'Atlanta, GA', stadium: 'Truist Park', founded: 1871, category: 'NL Powerhouses' },
      { name: 'Chicago Cubs', badge: '🔵', city: 'Chicago, IL', stadium: 'Wrigley Field', founded: 1876, category: 'Classic Ballparks' },
      { name: 'San Francisco Giants', badge: '🟠', city: 'San Francisco, CA', stadium: 'Oracle Park', founded: 1883, category: 'NL Powerhouses' },
      { name: 'St. Louis Cardinals', badge: '🔴', city: 'St. Louis, MO', stadium: 'Busch Stadium', founded: 1882, category: 'Classic Ballparks' },
    ],
  },
  {
    label: 'Hockey',
    icon: '🏒',
    slug: 'hockey',
    teams: [
      { name: 'Florida Panthers', badge: '🔴', city: 'Sunrise, FL', stadium: 'Amerant Bank Arena', founded: 1993, category: 'Stanley Cup Contenders' },
      { name: 'Edmonton Oilers', badge: '🔵', city: 'Edmonton, AB', stadium: 'Rogers Place', founded: 1972, category: 'Stanley Cup Contenders' },
      { name: 'New York Rangers', badge: '🔵', city: 'New York, NY', stadium: 'Madison Square Garden', founded: 1926, category: 'Original Six' },
      { name: 'Boston Bruins', badge: '🟡', city: 'Boston, MA', stadium: 'TD Garden', founded: 1924, category: 'Original Six' },
      { name: 'Colorado Avalanche', badge: '🔴', city: 'Denver, CO', stadium: 'Ball Arena', founded: 1972, category: 'Stanley Cup Contenders' },
      { name: 'Toronto Maple Leafs', badge: '🔵', city: 'Toronto, ON', stadium: 'Scotiabank Arena', founded: 1917, category: 'Original Six' },
      { name: 'Montreal Canadiens', badge: '🔴', city: 'Montreal, QC', stadium: 'Bell Centre', founded: 1909, category: 'Original Six' },
      { name: 'Vegas Golden Knights', badge: '🟡', city: 'Las Vegas, NV', stadium: 'T-Mobile Arena', founded: 2017, category: 'New Era' },
    ],
  },
  {
    label: 'Rugby',
    icon: '🏉',
    slug: 'rugby',
    teams: [
      { name: 'All Blacks', badge: '🇳🇿', city: 'New Zealand', stadium: 'Eden Park', founded: 1884, category: 'Southern Hemisphere' },
      { name: 'Springboks', badge: '🇿🇦', city: 'South Africa', stadium: 'Ellis Park', founded: 1891, category: 'Southern Hemisphere' },
      { name: 'Ireland', badge: '🇮🇪', city: 'Dublin', stadium: 'Aviva Stadium', founded: 1879, category: 'Six Nations' },
      { name: 'France', badge: '🇫🇷', city: 'Paris', stadium: 'Stade de France', founded: 1906, category: 'Six Nations' },
      { name: 'England', badge: '🏴', city: 'London', stadium: 'Twickenham', founded: 1871, category: 'Six Nations' },
      { name: 'Wallabies', badge: '🇦🇺', city: 'Australia', stadium: 'Stadium Australia', founded: 1899, category: 'Southern Hemisphere' },
    ],
  },
  {
    label: 'Cricket',
    icon: '🏏',
    slug: 'cricket',
    teams: [
      { name: 'Mumbai Indians', badge: '🔵', city: 'Mumbai, India', stadium: 'Wankhede Stadium', founded: 2008, category: 'IPL Franchises' },
      { name: 'Chennai Super Kings', badge: '🟡', city: 'Chennai, India', stadium: 'MA Chidambaram', founded: 2008, category: 'IPL Franchises' },
      { name: 'Royal Challengers', badge: '🔴', city: 'Bangalore, India', stadium: 'M. Chinnaswamy', founded: 2008, category: 'IPL Franchises' },
      { name: 'Kolkata Knight Riders', badge: '🟣', city: 'Kolkata, India', stadium: 'Eden Gardens', founded: 2008, category: 'IPL Franchises' },
      { name: 'India', badge: '🇮🇳', city: 'India', stadium: 'Various', founded: 1932, category: 'National Teams' },
      { name: 'Australia', badge: '🇦🇺', city: 'Australia', stadium: 'MCG', founded: 1877, category: 'National Teams' },
      { name: 'England', badge: '🏴', city: 'England', stadium: "Lord's", founded: 1877, category: 'National Teams' },
      { name: 'Pakistan', badge: '🇵🇰', city: 'Pakistan', stadium: 'Various', founded: 1952, category: 'National Teams' },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────

function slugToSport(slug: string): SportData | undefined {
  return SPORT_TEAMS.find((s) => s.slug === slug);
}

function groupByCategory(teams: TeamCard[]): { category: string; teams: TeamCard[] }[] {
  const map = new Map<string, TeamCard[]>();
  for (const t of teams) {
    const arr = map.get(t.category) ?? [];
    arr.push(t);
    map.set(t.category, arr);
  }
  const groups = Array.from(map.entries()).map(([category, teams]) => ({ category, teams }));
  groups.sort((a, b) => {
    const hashA = a.category.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const hashB = b.category.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    return hashA - hashB;
  });
  return groups;
}

// ── Exports for sidebar slug mapping ────────────────────────

export const SPORT_SLUGS = SPORT_TEAMS.map((s) => ({ label: s.label, icon: s.icon, slug: s.slug }));

// ── Reusable card component ─────────────────────────────────

function teamToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function TeamCardItem({ team, isDark, sportSlug }: { team: TeamCard; isDark: boolean; sportSlug: string }) {
  return (
    <Link to={`/teams/${sportSlug}/${teamToSlug(team.name)}`} className="block">
    <div
      className={`group relative rounded-xl border p-5 transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
        isDark
          ? 'bg-[#1a1a1a] border-white/10 hover:border-[#22c55e]/40'
          : 'bg-white border-gray-200 hover:border-[#22c55e]/50 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center text-2xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}
        >
          {team.badge}
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={`font-bold text-sm truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {team.name}
          </h3>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Est. {team.founded}
          </p>
        </div>
      </div>

      <div className={`h-px my-3 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />

      <div className="space-y-2">
        <div
          className={`flex items-center gap-2 text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <MapPin className="size-3.5 shrink-0 text-[#22c55e]" />
          <span className="truncate">{team.city}</span>
        </div>
        <div
          className={`flex items-center gap-2 text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <Users className="size-3.5 shrink-0 text-[#22c55e]" />
          <span className="truncate">{team.stadium}</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl bg-[#22c55e] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </div>
    </Link>
  );
}

// ── Page Component ──────────────────────────────────────────

export function Teams() {
  const { sportSlug } = useParams();
  const { isDark } = useOutletContext<RootContext>();
  const [activeTab, setActiveTab] = useState<'all' | 'categories'>('categories');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sport = slugToSport(sportSlug ?? '');
  const groups = useMemo(() => (sport ? groupByCategory(sport.teams) : []), [sport]);
  const categories = useMemo(() => groups.map((g) => g.category), [groups]);

  const filteredTeams = useMemo(() => {
    if (!sport) return [];
    let teams = sport.teams;
    if (activeCategory !== 'all') {
      teams = teams.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      teams = teams.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.stadium.toLowerCase().includes(q),
      );
    }
    return teams;
  }, [sport, activeCategory, searchQuery]);

  if (!sport) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? 'bg-[#0f0f0f]' : 'bg-gray-100'
        }`}
      >
        <div className="text-center space-y-4">
          <p className="text-6xl">🤷</p>
          <h2
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Sport not found
          </h2>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-[#22c55e] hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* ─── Header ───────────────────────────────── */}
      <div
        className={`border-b ${
          isDark ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            to="/home"
            className={`inline-flex items-center gap-1.5 text-sm mb-4 transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="size-4" /> Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{sport.icon}</div>
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {sport.label}
                </h1>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {sport.teams.length} teams · {groups.length} categories
                </p>
              </div>
            </div>

            {/* Search */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                isDark
                  ? 'bg-white/5 border-white/10 text-gray-400 focus-within:border-[#22c55e]/50'
                  : 'bg-gray-50 border-gray-200 text-gray-500 focus-within:border-[#22c55e]/50'
              }`}
            >
              <Search className="size-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams..."
                className={`bg-transparent outline-none w-40 placeholder:text-gray-500 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6">
            {(
              [
                { key: 'categories', label: 'By Category', icon: Layers },
                { key: 'all', label: 'All Teams', icon: LayoutGrid },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors text-sm ${
                  activeTab === key
                    ? isDark
                      ? 'border-[#22c55e] text-[#22c55e]'
                      : 'border-green-600 text-green-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category filter pills (shown in both tabs) */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === 'all'
                ? isDark
                  ? 'bg-[#22c55e]/15 text-[#22c55e]'
                  : 'bg-green-100 text-green-700'
                : isDark
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? isDark
                    ? 'bg-[#22c55e]/15 text-[#22c55e]'
                    : 'bg-green-100 text-green-700'
                  : isDark
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredTeams.length === 0 ? (
          <div
            className={`text-center py-16 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <Search className="size-10 mx-auto mb-3 opacity-40" />
            <p>No teams match your search.</p>
          </div>
        ) : activeTab === 'categories' ? (
          /* ── By Category view ── */
          <div className="space-y-10">
            {(activeCategory === 'all' ? groups : groups.filter((g) => g.category === activeCategory)).map(
              (group) => (
                <section key={group.category}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block w-1 h-5 rounded-full bg-[#22c55e]" />
                    <h2
                      className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {group.category}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark
                          ? 'bg-white/5 text-gray-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {group.teams.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.teams
                      .filter((t) => {
                        if (!searchQuery.trim()) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          t.name.toLowerCase().includes(q) ||
                          t.city.toLowerCase().includes(q) ||
                          t.stadium.toLowerCase().includes(q)
                        );
                      })
                      .map((team) => (
                        <TeamCardItem key={team.name} team={team} isDark={isDark} sportSlug={sport.slug} />
                      ))}
                  </div>
                </section>
              ),
            )}
          </div>
        ) : (
          /* ── All Teams flat grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeams.map((team) => (
              <TeamCardItem key={team.name} team={team} isDark={isDark} sportSlug={sport.slug} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}