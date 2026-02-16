import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Trophy,
  Users,
  Star,
  Newspaper,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router';
import { useAppSelector } from '@/store/hooks';
import { SPORT_SLUGS } from '@/ui/pages/Teams';

// ── Data Types ──────────────────────────────────────────────

interface League {
  name: string;
  emoji?: string;
  slug: string;
}

interface SportCategory {
  name: string;
  icon: string;
  leagues: League[];
}

// ── Static Data ─────────────────────────────────────────────

const COMPETITIONS: SportCategory[] = [
  {
    name: 'Football (Soccer)',
    icon: '⚽',
    leagues: [
      { name: 'FIFA World Cup 2026', emoji: '🏆', slug: 'fifa-world-cup-2026' },
      { name: 'UEFA Champions League', emoji: '🌟', slug: 'uefa-champions-league' },
      { name: 'Premier League', emoji: '⚽', slug: 'premier-league' },
      { name: 'La Liga', emoji: '⚽', slug: 'la-liga' },
      { name: 'Serie A', emoji: '⚽', slug: 'serie-a' },
      { name: 'Bundesliga', emoji: '⚽', slug: 'bundesliga' },
      { name: 'Ligue 1', emoji: '⚽', slug: 'ligue-1' },
      { name: 'MLS', emoji: '⚽', slug: 'mls' },
    ],
  },
  {
    name: 'Basketball',
    icon: '🏀',
    leagues: [
      { name: 'NBA', emoji: '�', slug: 'nba' },
      { name: 'EuroLeague', emoji: '🏀', slug: 'euroleague' },
      { name: 'FIBA World Cup', emoji: '🏆', slug: 'fiba-world-cup' },
    ],
  },
  {
    name: 'American Football',
    icon: '🏈',
    leagues: [
      { name: 'NFL', emoji: '�', slug: 'nfl' },
      { name: 'College Football', emoji: '🎓', slug: 'college-football' },
    ],
  },
  {
    name: 'Baseball',
    icon: '⚾',
    leagues: [
      { name: 'MLB', emoji: '⚾', slug: 'mlb' },
      { name: 'World Baseball Classic', emoji: '🏆', slug: 'world-baseball-classic' },
    ],
  },
  {
    name: 'Tennis',
    icon: '🎾',
    leagues: [
      { name: 'Grand Slams', emoji: '🏆', slug: 'grand-slams' },
      { name: 'ATP Tour', emoji: '🎾', slug: 'atp-tour' },
      { name: 'WTA Tour', emoji: '🎾', slug: 'wta-tour' },
    ],
  },
  {
    name: 'Hockey',
    icon: '🏒',
    leagues: [
      { name: 'NHL', emoji: '�', slug: 'nhl' },
      { name: 'IIHF World Championship', emoji: '🏆', slug: 'iihf-world-championship' },
    ],
  },
  {
    name: 'Rugby',
    icon: '🏉',
    leagues: [
      { name: 'Rugby World Cup', emoji: '🏆', slug: 'rugby-world-cup' },
      { name: 'Six Nations', emoji: '�', slug: 'six-nations' },
    ],
  },
  {
    name: 'Cricket',
    icon: '🏏',
    leagues: [
      { name: 'ICC Cricket World Cup', emoji: '🏆', slug: 'icc-cricket-world-cup' },
      { name: 'IPL', emoji: '�', slug: 'ipl' },
      { name: 'The Ashes', emoji: '🏏', slug: 'the-ashes' },
    ],
  },
];

// ── News items per sport ────────────────────────────────────

interface NewsItem {
  title: string;
  emoji: string;
  date: string;
}

const NEWS_BY_SPORT: { sport: string; icon: string; items: NewsItem[] }[] = [
  {
    sport: 'Football',
    icon: '⚽',
    items: [
      { title: 'World Cup 2026 Draw Confirmed', emoji: '🏆', date: 'Feb 14' },
      { title: 'Champions League QF matchups set', emoji: '🌟', date: 'Feb 13' },
      { title: 'Premier League title race heats up', emoji: '⚽', date: 'Feb 12' },
      { title: 'MLS 2026 season kicks off March 1', emoji: '⚽', date: 'Feb 10' },
    ],
  },
  {
    sport: 'Basketball',
    icon: '🏀',
    items: [
      { title: 'NBA All-Star Weekend recap', emoji: '⭐', date: 'Feb 15' },
      { title: 'Trade deadline winners & losers', emoji: '🔄', date: 'Feb 11' },
    ],
  },
  {
    sport: 'American Football',
    icon: '🏈',
    items: [
      { title: 'Super Bowl LX Preview', emoji: '🏟️', date: 'Feb 9' },
      { title: 'NFL Combine top performers', emoji: '💪', date: 'Feb 8' },
    ],
  },
  {
    sport: 'Baseball',
    icon: '⚾',
    items: [
      { title: 'MLB Spring Training underway', emoji: '☀️', date: 'Feb 14' },
    ],
  },
  {
    sport: 'Hockey',
    icon: '🏒',
    items: [
      { title: 'NHL playoff race tightens', emoji: '🧊', date: 'Feb 13' },
    ],
  },
];

// Country‑flag lookup for "My Teams" display (ISO 3166-1 alpha-2 codes → flagcdn.com)
const TEAM_FLAG_CODES: Record<string, string> = {
  USA: 'us', Mexico: 'mx', Canada: 'ca', Argentina: 'ar', Brazil: 'br',
  Chile: 'cl', Colombia: 'co', Uruguay: 'uy',
  England: 'gb-eng', Germany: 'de', France: 'fr', Spain: 'es', Italy: 'it',
  Netherlands: 'nl', Portugal: 'pt', Belgium: 'be', Croatia: 'hr',
  Poland: 'pl', Denmark: 'dk', Switzerland: 'ch', Austria: 'at',
  'Czech Republic': 'cz', Morocco: 'ma', Nigeria: 'ng', Ghana: 'gh',
  Senegal: 'sn', Japan: 'jp', 'South Korea': 'kr', Iran: 'ir',
  'Saudi Arabia': 'sa', Qatar: 'qa', Australia: 'au',
};

// ── Component ───────────────────────────────────────────────

interface SportsSidebarProps {
  isDark?: boolean;
}

type SectionKey = 'competitions' | 'teams' | 'myTeams' | 'news';

export function SportsSidebar({ isDark = true }: SportsSidebarProps) {
  const favoriteTeams = useAppSelector((s) => s.user.favoriteTeams);

  // Which top-level sections are open
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set(['competitions'])
  );
  // Which sub-groups inside a section are open (keyed by name)
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  // ── helpers ──
  const sectionBtn = (
    key: SectionKey,
    icon: React.ReactNode,
    label: string,
  ) => {
    const open = openSections.has(key);
    return (
      <button
        onClick={() => toggleSection(key)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
          open
            ? isDark
              ? 'text-white bg-white/5'
              : 'text-gray-900 bg-gray-50'
            : isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        {icon}
        <span className="flex-1">{label}</span>
        {open ? (
          <ChevronDown className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        ) : (
          <ChevronRight className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        )}
      </button>
    );
  };

  const groupBtn = (icon: string, label: string) => {
    const open = openGroups.has(label);
    return (
      <button
        onClick={() => toggleGroup(label)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
        }`}
      >
        <span className="text-sm">{icon}</span>
        <span
          className={`flex-1 font-medium ${
            open
              ? isDark ? 'text-white' : 'text-gray-900'
              : isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {label}
        </span>
        {open ? (
          <ChevronDown className={`size-3.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        ) : (
          <ChevronRight className={`size-3.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        )}
      </button>
    );
  };

  return (
    <div
      className={`border rounded-xl p-4 space-y-1 ${
        isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* ─── Competitions ─────────────────────────── */}
      {sectionBtn(
        'competitions',
        <Trophy className={`size-4 ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`} />,
        'Competitions',
      )}
      {openSections.has('competitions') && (
        <div className="ml-2 mt-1 mb-2 space-y-0.5">
          {COMPETITIONS.map((cat) => (
            <div key={cat.name}>
              {groupBtn(cat.icon, cat.name)}
              {openGroups.has(cat.name) && (
                <div className="ml-7 mt-0.5 mb-1 space-y-0.5">
                  {cat.leagues.map((lg) => (
                    <Link
                      key={lg.slug}
                      to={`/competition/${lg.slug}`}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs">{lg.emoji}</span>
                      <span>{lg.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Teams ────────────────────────────────── */}
      {sectionBtn(
        'teams',
        <Users className={`size-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />,
        'Teams',
      )}
      {openSections.has('teams') && (
        <div className="ml-2 mt-1 mb-2 space-y-0.5">
          {SPORT_SLUGS.map((s) => (
            <Link
              key={s.slug}
              to={`/teams/${s.slug}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm">{s.icon}</span>
              <span className="font-medium">{s.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* ─── My Teams ─────────────────────────────── */}
      {sectionBtn(
        'myTeams',
        <Star className={`size-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />,
        'My Teams',
      )}
      {openSections.has('myTeams') && (
        <div className="ml-2 mt-1 mb-2 space-y-0.5">
          {favoriteTeams.length === 0 ? (
            <p className={`px-3 py-2 text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              No favorite teams yet — pick some on the Welcome page!
            </p>
          ) : (
            favoriteTeams.map((team) => {
              const code = TEAM_FLAG_CODES[team];
              return (
                <div
                  key={team}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {code ? (
                    <img
                      src={`https://flagcdn.com/w40/${code}.png`}
                      alt={team}
                      className="w-5 h-auto rounded-sm object-cover"
                    />
                  ) : (
                    <span className="text-sm">⚽</span>
                  )}
                  <span className="font-medium">{team}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─── News ─────────────────────────────────── */}
      {sectionBtn(
        'news',
        <Newspaper className={`size-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />,
        'News',
      )}
      {openSections.has('news') && (
        <div className="ml-2 mt-1 mb-2 space-y-0.5">
          {NEWS_BY_SPORT.map((sport) => (
            <div key={sport.sport}>
              {groupBtn(sport.icon, sport.sport)}
              {openGroups.has(sport.sport) && (
                <div className="ml-7 mt-0.5 mb-1 space-y-0.5">
                  {sport.items.map((item) => (
                    <div
                      key={item.title}
                      className={`flex items-start gap-2 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                        isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs mt-0.5 shrink-0">{item.emoji}</span>
                      <div className="min-w-0">
                        <span className="line-clamp-1">{item.title}</span>
                        <span className={`block text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Blog ─────────────────────────────────── */}
      <Link
        to="/blog"
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
          isDark
            ? 'text-gray-400 hover:text-white hover:bg-white/5'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <BookOpen className={`size-4 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
        <span className="flex-1">Blog</span>
      </Link>

      {/* ─── Separator ────────────────────────────── */}
      <div className={`my-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`} />

      {/* ─── Bottom links ─────────────────────────── */}
      <div className="space-y-0.5">
        <button
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Settings className="size-4" />
          <span>Settings</span>
        </button>
        <button
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <HelpCircle className="size-4" />
          <span>Help & FAQ</span>
        </button>
        <button
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
            isDark
              ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/5'
              : 'text-red-500/70 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
