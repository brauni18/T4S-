import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface League {
  name: string;
  emoji?: string;
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
      { name: 'FIFA World Cup 2026', emoji: '🏆' },
      { name: 'UEFA Champions League', emoji: '🌟' },
      { name: 'Premier League', emoji: '🏴' },
      { name: 'La Liga', emoji: '🇪🇸' },
      { name: 'Serie A', emoji: '🇮🇹' },
      { name: 'Bundesliga', emoji: '🇩🇪' },
      { name: 'Ligue 1', emoji: '🇫🇷' },
      { name: 'MLS', emoji: '🇺🇸' },
    ],
  },
  {
    name: 'Basketball',
    icon: '🏀',
    leagues: [
      { name: 'NBA', emoji: '🇺🇸' },
      { name: 'EuroLeague', emoji: '🇪🇺' },
      { name: 'FIBA World Cup', emoji: '🏆' },
    ],
  },
  {
    name: 'American Football',
    icon: '🏈',
    leagues: [
      { name: 'NFL', emoji: '🇺🇸' },
      { name: 'College Football', emoji: '🎓' },
    ],
  },
  {
    name: 'Baseball',
    icon: '⚾',
    leagues: [
      { name: 'MLB', emoji: '🇺🇸' },
      { name: 'World Baseball Classic', emoji: '🏆' },
    ],
  },
  {
    name: 'Tennis',
    icon: '🎾',
    leagues: [
      { name: 'Grand Slams', emoji: '🏆' },
      { name: 'ATP Tour', emoji: '🎾' },
      { name: 'WTA Tour', emoji: '🎾' },
    ],
  },
  {
    name: 'Hockey',
    icon: '🏒',
    leagues: [
      { name: 'NHL', emoji: '🇺🇸' },
      { name: 'IIHF World Championship', emoji: '🏆' },
    ],
  },
  {
    name: 'Rugby',
    icon: '🏉',
    leagues: [
      { name: 'Rugby World Cup', emoji: '🏆' },
      { name: 'Six Nations', emoji: '🇪🇺' },
    ],
  },
  {
    name: 'Cricket',
    icon: '🏏',
    leagues: [
      { name: 'ICC Cricket World Cup', emoji: '🏆' },
      { name: 'IPL', emoji: '🇮🇳' },
      { name: 'The Ashes', emoji: '🇬🇧' },
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
                    <button
                      key={league.name}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                        transition-colors text-left ${
                          isDark
                            ? 'text-gray-400 hover:text-white hover:bg-white/5'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-xs">{league.emoji}</span>
                      <span>{league.name}</span>
                    </button>
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
