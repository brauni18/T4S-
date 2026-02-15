import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

interface League {
  name: string;
  emoji?: string;
  slug: string; // URL slug for navigation
}

interface SportCategory {
  name: string;
  icon: string;
  leagues: League[];
}

const SPORTS_CATEGORIES: SportCategory[] = [
  {
    name: 'Football (Soccer)',
    icon: '⚽',
    leagues: [
      { name: 'FIFA World Cup 2026', emoji: '🏆', slug: 'fifa-world-cup-2026' },
      { name: 'UEFA Champions League', emoji: '🌟', slug: 'uefa-champions-league' },
      { name: 'Premier League', emoji: '🏴', slug: 'premier-league' },
      { name: 'La Liga', emoji: '🇪🇸', slug: 'la-liga' },
      { name: 'Serie A', emoji: '🇮🇹', slug: 'serie-a' },
      { name: 'Bundesliga', emoji: '🇩🇪', slug: 'bundesliga' },
      { name: 'Ligue 1', emoji: '🇫🇷', slug: 'ligue-1' },
      { name: 'MLS', emoji: '🇺🇸', slug: 'mls' },
    ],
  },
  {
    name: 'Basketball',
    icon: '🏀',
    leagues: [
      { name: 'NBA', emoji: '🇺🇸', slug: 'nba' },
      { name: 'EuroLeague', emoji: '🇪🇺', slug: 'euroleague' },
      { name: 'FIBA World Cup', emoji: '🏆', slug: 'fiba-world-cup' },
    ],
  },
  {
    name: 'American Football',
    icon: '🏈',
    leagues: [
      { name: 'NFL', emoji: '🇺🇸', slug: 'nfl' },
      { name: 'College Football', emoji: '🎓', slug: 'college-football' },
    ],
  },
  {
    name: 'Baseball',
    icon: '⚾',
    leagues: [
      { name: 'MLB', emoji: '🇺🇸', slug: 'mlb' },
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
      { name: 'NHL', emoji: '🇺🇸', slug: 'nhl' },
      { name: 'IIHF World Championship', emoji: '🏆', slug: 'iihf-world-championship' },
    ],
  },
  {
    name: 'Rugby',
    icon: '🏉',
    leagues: [
      { name: 'Rugby World Cup', emoji: '🏆', slug: 'rugby-world-cup' },
      { name: 'Six Nations', emoji: '🇪🇺', slug: 'six-nations' },
    ],
  },
  {
    name: 'Cricket',
    icon: '🏏',
    leagues: [
      { name: 'ICC Cricket World Cup', emoji: '🏆', slug: 'icc-cricket-world-cup' },
      { name: 'IPL', emoji: '🇮🇳', slug: 'ipl' },
      { name: 'The Ashes', emoji: '🇬🇧', slug: 'the-ashes' },
    ],
  },
];

interface SportsSidebarProps {
  isDark?: boolean;
}

export function SportsSidebar({ isDark = true }: SportsSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Football (Soccer)'])
  );

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div
      className={`border rounded-xl p-4 ${
        isDark
          ? 'bg-[#1a1a1a] border-white/10'
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <h3
        className={`font-bold text-sm mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Sports & Leagues
      </h3>
      <nav className="space-y-1">
        {SPORTS_CATEGORIES.map((category) => {
          const isExpanded = expandedCategories.has(category.name);
          return (
            <div key={category.name}>
              <button
                onClick={() => toggleCategory(category.name)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm
                  transition-colors text-left group ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                  }`}
              >
                <span className="text-base">{category.icon}</span>
                <span
                  className={`flex-1 font-medium ${
                    isExpanded
                      ? isDark
                        ? 'text-white'
                        : 'text-gray-900'
                      : isDark
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  {category.name}
                </span>
                {isExpanded ? (
                  <ChevronDown
                    className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  />
                ) : (
                  <ChevronRight
                    className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  />
                )}
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 mb-2 space-y-0.5">
                  {category.leagues.map((league) => (
                    <Link
                      key={league.name}
                      to={`/competition/${league.slug}`}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                        transition-colors text-left ${
                          isDark
                            ? 'text-gray-400 hover:text-white hover:bg-white/5'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-xs">{league.emoji}</span>
                      <span>{league.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
