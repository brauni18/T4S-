import { useParams } from 'react-router';
import { useState } from 'react';
import type { Match } from '@/types/match.type';
import type { ForumPost } from '@/types/match.type';
import { Calendar, MapPin, Users, MessageSquare, TrendingUp, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Sun, Moon } from 'lucide-react';

interface CompetitionPageProps {
  isDark?: boolean;
}

// Competition mapping - maps URL slugs to display names
const COMPETITION_MAP: Record<string, { name: string; emoji: string; description: string }> = {
  'fifa-world-cup-2026': {
    name: 'FIFA World Cup 2026',
    emoji: '🏆',
    description: 'The biggest football tournament in the world, hosted in USA, Canada & Mexico'
  },
  'uefa-champions-league': {
    name: 'UEFA Champions League',
    emoji: '🌟',
    description: 'Europe\'s premier club football competition'
  },
  'premier-league': {
    name: 'Premier League',
    emoji: '🏴',
    description: 'England\'s top-tier football league'
  },
  'la-liga': {
    name: 'La Liga',
    emoji: '🇪🇸',
    description: 'Spain\'s premier football division'
  },
  'nba': {
    name: 'NBA',
    emoji: '🇺🇸',
    description: 'National Basketball Association - America\'s premier basketball league'
  },
  'nfl': {
    name: 'NFL',
    emoji: '🇺🇸',
    description: 'National Football League - America\'s premier football league'
  }
};

// Mock data for demonstration
const MOCK_COMPETITION_MATCHES: Record<string, Match[]> = {
  'fifa-world-cup-2026': [
    { _id: '1', homeTeam: 'Mexico', awayTeam: 'Germany', date: '2026-06-11T18:00:00Z', stage: 'Group A', venue: 'AT&T Stadium', city: 'Dallas', createdAt: '', updatedAt: '' },
    { _id: '2', homeTeam: 'USA', awayTeam: 'Brazil', date: '2026-06-12T20:00:00Z', stage: 'Group B', venue: 'MetLife Stadium', city: 'New York', createdAt: '', updatedAt: '' },
    { _id: '3', homeTeam: 'England', awayTeam: 'Japan', date: '2026-06-13T16:00:00Z', stage: 'Group C', venue: 'SoFi Stadium', city: 'Los Angeles', createdAt: '', updatedAt: '' },
    { _id: '4', homeTeam: 'France', awayTeam: 'Argentina', date: '2026-06-14T20:00:00Z', stage: 'Group D', venue: 'Hard Rock Stadium', city: 'Miami', createdAt: '', updatedAt: '' }
  ]
};

const MOCK_COMPETITION_POSTS: Record<string, ForumPost[]> = {
  'fifa-world-cup-2026': [
    {
      _id: 'p1',
      createdBy: { _id: 'u1', name: 'Carlos M.', location: 'Mexico City', favoriteTeams: ['Mexico'] },
      title: 'Group A Predictions - Mexico vs Germany',
      content: 'What do you think about Mexico\'s chances against Germany? The home advantage could be huge!',
      matchId: 'm1',
      postType: 'discussion',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      _id: 'p2',
      createdBy: { _id: 'u2', name: 'Sarah K.', location: 'London', favoriteTeams: ['USA'] },
      title: 'USA vs Brazil Watch Party in NYC',
      content: 'Organizing a massive watch party for USA vs Brazil at Madison Square Garden area. Who\'s in?',
      matchId: 'm2',
      postType: 'watch-party',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    }
  ]
};

export function Competition({ isDark = true }: CompetitionPageProps) {
  const { competitionSlug } = useParams<{ competitionSlug: string }>();
  const [activeTab, setActiveTab] = useState<'matches' | 'posts' | 'stats'>('matches');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isDarkMode, setIsDarkMode] = useState(isDark);

  const competition = competitionSlug ? COMPETITION_MAP[competitionSlug] : null;
  const matches = competitionSlug ? MOCK_COMPETITION_MATCHES[competitionSlug] || [] : [];
  const posts = competitionSlug ? MOCK_COMPETITION_POSTS[competitionSlug] || [] : [];

  if (!competition) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Competition Not Found</h1>
          <p className="text-gray-500">The competition you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`border-b ${
        isDarkMode ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{competition.emoji}</div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {competition.name}
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {competition.description}
                </p>
              </div>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-sm border border-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6">
            {[
              { key: 'matches', label: 'Matches', icon: Calendar },
              { key: 'posts', label: 'Community', icon: MessageSquare },
              { key: 'stats', label: 'Statistics', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                  activeTab === key
                    ? isDarkMode
                      ? 'border-[#22c55e] text-[#22c55e]'
                      : 'border-green-600 text-green-600'
                    : isDarkMode
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter:
            </span>
          </div>
          {['all', 'upcoming', 'completed'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === filterOption
                  ? isDarkMode
                    ? 'bg-[#22c55e]/15 text-[#22c55e]'
                    : 'bg-green-100 text-green-700'
                  : isDarkMode
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match._id}
                className={`p-6 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#1a1a1a] border-white/10 hover:border-white/20' 
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-[#22c55e]/15 text-[#22c55e]' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {match.stage}
                  </span>
                  <div className={`text-right text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div>{format(new Date(match.date), 'MMM d, yyyy')}</div>
                    <div>{format(new Date(match.date), 'h:mm a')}</div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {match.homeTeam}
                  </div>
                  <div className="text-sm text-gray-500 my-2">vs</div>
                  <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {match.awayTeam}
                  </div>
                </div>

                <div className={`flex items-center justify-center gap-2 text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <MapPin className="size-3" />
                  <span>{match.venue}, {match.city}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className={`p-6 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-[#1a1a1a] border-white/10' 
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isDarkMode ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-green-100 text-green-700'
                  }`}>
                    {post.createdBy.name.charAt(0)}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {post.createdBy.name}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      📍 {post.createdBy.location}
                    </div>
                  </div>
                </div>

                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.content}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.postType === 'discussion'
                      ? isDarkMode ? 'bg-blue-400/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                      : isDarkMode ? 'bg-purple-400/10 text-purple-400' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {post.postType === 'discussion' ? '💬 Discussion' : '📺 Watch Party'}
                  </span>
                  <div className={`flex items-center gap-1 text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <Users className="size-3" />
                    <span>Join discussion</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className={`text-center py-12 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <TrendingUp className="size-12 mx-auto mb-4 opacity-50" />
            <p>Statistics coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}