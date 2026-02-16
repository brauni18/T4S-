import { useParams, Link, useOutletContext } from 'react-router';
import { useState, useMemo } from 'react';
import type { Match } from '@/types/match.type';
import type { ForumPost } from '@/types/match.type';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  MessageSquare,
  TrendingUp,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { useGetMatchesQuery } from '@/store/apis/matches.api';
import type { RootContext } from '@/ui/Root';

// ── Competition registry ────────────────────────────────────

interface CompetitionInfo {
  name: string;
  emoji: string;
  description: string;
  sport: string;
}

const COMPETITION_MAP: Record<string, CompetitionInfo> = {
  // Football
  'fifa-world-cup-2026': { name: 'FIFA World Cup 2026', emoji: '🏆', description: 'The biggest football tournament in the world, hosted in USA, Canada & Mexico', sport: 'Football' },
  'uefa-champions-league': { name: 'UEFA Champions League', emoji: '🌟', description: "Europe's premier club football competition", sport: 'Football' },
  'premier-league': { name: 'Premier League', emoji: '🏴', description: "England's top-tier football league", sport: 'Football' },
  'la-liga': { name: 'La Liga', emoji: '🇪🇸', description: "Spain's premier football division", sport: 'Football' },
  'serie-a': { name: 'Serie A', emoji: '🇮🇹', description: "Italy's top professional football league", sport: 'Football' },
  'bundesliga': { name: 'Bundesliga', emoji: '🇩🇪', description: "Germany's premier football league", sport: 'Football' },
  'ligue-1': { name: 'Ligue 1', emoji: '🇫🇷', description: "France's top-tier football league", sport: 'Football' },
  'mls': { name: 'MLS', emoji: '🇺🇸', description: "Major League Soccer — top professional soccer league in North America", sport: 'Football' },
  // Basketball
  'nba': { name: 'NBA', emoji: '🏀', description: "National Basketball Association — America's premier basketball league", sport: 'Basketball' },
  'euroleague': { name: 'EuroLeague', emoji: '🏀', description: "Europe's premier professional basketball club competition", sport: 'Basketball' },
  // American Football
  'nfl': { name: 'NFL', emoji: '🏈', description: "National Football League — America's premier football league", sport: 'American Football' },
  // Baseball
  'mlb': { name: 'MLB', emoji: '⚾', description: "Major League Baseball — America's premier baseball league", sport: 'Baseball' },
  // Hockey
  'nhl': { name: 'NHL', emoji: '🏒', description: "National Hockey League — premier professional ice hockey league", sport: 'Hockey' },
  // Rugby
  'six-nations': { name: 'Six Nations', emoji: '🏉', description: "Annual international rugby union competition of six European teams", sport: 'Rugby' },
  'rugby-world-cup': { name: 'Rugby World Cup', emoji: '🏉', description: "The premier international rugby union competition", sport: 'Rugby' },
  // Cricket
  'ipl': { name: 'IPL', emoji: '🏏', description: "Indian Premier League — premier T20 cricket league", sport: 'Cricket' },
  'cricket-world-cup': { name: 'Cricket World Cup', emoji: '🏏', description: "The premier international cricket competition", sport: 'Cricket' },
};

// ── Placeholder matches (grouped by stage/category) ─────────

const PLACEHOLDER_MATCHES: Match[] = [
  { _id: '1', homeTeam: 'Mexico', awayTeam: 'Germany', date: '2026-06-11T18:00:00Z', stage: 'Group A', venue: 'AT&T Stadium', city: 'Dallas', createdAt: '', updatedAt: '' },
  { _id: '2', homeTeam: 'USA', awayTeam: 'Brazil', date: '2026-06-12T20:00:00Z', stage: 'Group B', venue: 'MetLife Stadium', city: 'New York', createdAt: '', updatedAt: '' },
  { _id: '3', homeTeam: 'England', awayTeam: 'Japan', date: '2026-06-13T16:00:00Z', stage: 'Group C', venue: 'SoFi Stadium', city: 'Los Angeles', createdAt: '', updatedAt: '' },
  { _id: '4', homeTeam: 'France', awayTeam: 'Argentina', date: '2026-06-14T20:00:00Z', stage: 'Group D', venue: 'Hard Rock Stadium', city: 'Miami', createdAt: '', updatedAt: '' },
  { _id: '5', homeTeam: 'Spain', awayTeam: 'Netherlands', date: '2026-06-15T18:00:00Z', stage: 'Group E', venue: 'Lincoln Financial Field', city: 'Philadelphia', createdAt: '', updatedAt: '' },
  { _id: '6', homeTeam: 'Canada', awayTeam: 'Morocco', date: '2026-06-16T16:00:00Z', stage: 'Group F', venue: 'BMO Field', city: 'Toronto', createdAt: '', updatedAt: '' },
  { _id: '7', homeTeam: 'Portugal', awayTeam: 'South Korea', date: '2026-06-17T18:00:00Z', stage: 'Group G', venue: 'Estadio Azteca', city: 'Mexico City', createdAt: '', updatedAt: '' },
  { _id: '8', homeTeam: 'Belgium', awayTeam: 'Nigeria', date: '2026-06-18T20:00:00Z', stage: 'Group H', venue: 'Lumen Field', city: 'Seattle', createdAt: '', updatedAt: '' },
  { _id: '9', homeTeam: 'Germany', awayTeam: 'Brazil', date: '2026-06-28T20:00:00Z', stage: 'Round of 16', venue: 'AT&T Stadium', city: 'Dallas', createdAt: '', updatedAt: '' },
  { _id: '10', homeTeam: 'France', awayTeam: 'England', date: '2026-06-29T20:00:00Z', stage: 'Round of 16', venue: 'SoFi Stadium', city: 'Los Angeles', createdAt: '', updatedAt: '' },
  { _id: '11', homeTeam: 'USA', awayTeam: 'Argentina', date: '2026-07-04T20:00:00Z', stage: 'Quarter-Finals', venue: 'MetLife Stadium', city: 'New York', createdAt: '', updatedAt: '' },
  { _id: '12', homeTeam: 'Mexico', awayTeam: 'France', date: '2026-07-10T20:00:00Z', stage: 'Semi-Finals', venue: 'AT&T Stadium', city: 'Dallas', createdAt: '', updatedAt: '' },
];

// ── Mock posts ──────────────────────────────────────────────

const MOCK_COMPETITION_POSTS: Record<string, ForumPost[]> = {
  'fifa-world-cup-2026': [
    {
      _id: 'p1',
      createdBy: { _id: 'u1', name: 'Carlos M.', location: 'Mexico City', favoriteTeams: ['Mexico'] },
      title: 'Group A Predictions - Mexico vs Germany',
      content: "What do you think about Mexico's chances against Germany? The home advantage could be huge!",
      matchId: 'm1',
      postType: 'discussion',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      _id: 'p2',
      createdBy: { _id: 'u2', name: 'Sarah K.', location: 'London', favoriteTeams: ['USA'] },
      title: 'USA vs Brazil Watch Party in NYC',
      content: "Organizing a massive watch party for USA vs Brazil at Madison Square Garden area. Who's in?",
      matchId: 'm2',
      postType: 'watch-party',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      _id: 'p3',
      createdBy: { _id: 'u3', name: 'Jamal T.', location: 'Toronto', favoriteTeams: ['Canada'] },
      title: 'Best fan zones in Toronto for Group F?',
      content: "Canada takes on Morocco — looking for the best spots in downtown Toronto to watch live. Any recommendations?",
      matchId: 'm6',
      postType: 'discussion',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      _id: 'p4',
      createdBy: { _id: 'u4', name: 'Lena R.', location: 'Berlin', favoriteTeams: ['Germany'] },
      title: 'Travel tips: Dallas for Group A',
      content: "Booked my flights! Any German fans heading to Dallas for the opener? Let's coordinate on accommodation.",
      matchId: 'm1',
      postType: 'discussion',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ],
};

// ── Helpers ──────────────────────────────────────────────────

function groupMatchesByStage(matches: Match[]): { stage: string; matches: Match[] }[] {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const arr = map.get(m.stage) ?? [];
    arr.push(m);
    map.set(m.stage, arr);
  }
  return Array.from(map.entries()).map(([stage, matches]) => ({ stage, matches }));
}

// ── Component ───────────────────────────────────────────────

export function Competition() {
  const { competitionSlug } = useParams<{ competitionSlug: string }>();
  const { isDark } = useOutletContext<RootContext>();
  const [activeTab, setActiveTab] = useState<'matches' | 'posts' | 'stats'>('matches');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [activeStage, setActiveStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: apiMatches } = useGetMatchesQuery();

  const competition = competitionSlug ? COMPETITION_MAP[competitionSlug] : null;
  const allMatches = apiMatches && apiMatches.length > 0 ? apiMatches : PLACEHOLDER_MATCHES;

  const now = new Date();
  const filteredByTime =
    filter === 'all'
      ? allMatches
      : filter === 'upcoming'
        ? allMatches.filter((m) => new Date(m.date) >= now)
        : allMatches.filter((m) => new Date(m.date) < now);

  const stages = useMemo(() => {
    const s = new Set(allMatches.map((m) => m.stage));
    return Array.from(s);
  }, [allMatches]);

  const matches = useMemo(() => {
    let result = filteredByTime;
    if (activeStage !== 'all') {
      result = result.filter((m) => m.stage === activeStage);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q),
      );
    }
    return result;
  }, [filteredByTime, activeStage, searchQuery]);

  const groupedMatches = useMemo(() => groupMatchesByStage(matches), [matches]);

  const posts = competitionSlug ? MOCK_COMPETITION_POSTS[competitionSlug] || [] : [];

  if (!competition) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="text-center space-y-4">
          <p className="text-6xl">🤷</p>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Competition Not Found
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            The competition you're looking for doesn't exist.
          </p>
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
              <div className="text-4xl">{competition.emoji}</div>
              <div>
                <h1
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {competition.name}
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {competition.description}
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
                placeholder="Search matches..."
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
                { key: 'matches', label: 'Matches', icon: Calendar },
                { key: 'posts', label: 'Community', icon: MessageSquare },
                { key: 'stats', label: 'Statistics', icon: TrendingUp },
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
        {/* ── Matches tab ── */}
        {activeTab === 'matches' && (
          <>
            {/* Filter pills: time + stage categories */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {/* Time filters */}
              {(['all', 'upcoming', 'completed'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                    filter === opt
                      ? isDark
                        ? 'bg-[#22c55e]/15 text-[#22c55e]'
                        : 'bg-green-100 text-green-700'
                      : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}

              {/* Divider */}
              <div
                className={`w-px h-5 mx-1 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
              />

              {/* Stage category pills */}
              <button
                onClick={() => setActiveStage('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeStage === 'all'
                    ? isDark
                      ? 'bg-blue-500/15 text-blue-400'
                      : 'bg-blue-100 text-blue-700'
                    : isDark
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                All Stages
              </button>
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeStage === stage
                      ? isDark
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'bg-blue-100 text-blue-700'
                      : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            {matches.length === 0 ? (
              <div
                className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <Search className="size-10 mx-auto mb-3 opacity-40" />
                <p>No matches found.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {groupedMatches.map((group) => (
                  <section key={group.stage}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-block w-1 h-5 rounded-full bg-[#22c55e]" />
                      <h2
                        className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                      >
                        {group.stage}
                      </h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark
                            ? 'bg-white/5 text-gray-500'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {group.matches.length} {group.matches.length === 1 ? 'match' : 'matches'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.matches.map((match) => (
                        <Link
                          key={match._id}
                          to={`/matches/${match._id}`}
                          className={`group relative block p-5 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
                            isDark
                              ? 'bg-[#1a1a1a] border-white/10 hover:border-[#22c55e]/40'
                              : 'bg-white border-gray-200 hover:border-[#22c55e]/50 shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isDark
                                  ? 'bg-[#22c55e]/15 text-[#22c55e]'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {match.stage}
                            </span>
                            <div
                              className={`text-right text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              <div>{format(new Date(match.date), 'MMM d, yyyy')}</div>
                              <div>{format(new Date(match.date), 'h:mm a')}</div>
                            </div>
                          </div>

                          <div className="text-center mb-4">
                            <div
                              className={`font-bold text-lg ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {match.homeTeam}
                            </div>
                            <div className="text-sm text-gray-500 my-2">vs</div>
                            <div
                              className={`font-bold text-lg ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {match.awayTeam}
                            </div>
                          </div>

                          <div
                            className={`flex items-center justify-center gap-2 text-xs ${
                              isDark ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          >
                            <MapPin className="size-3 text-[#22c55e]" />
                            <span>
                              {match.venue}, {match.city}
                            </span>
                          </div>

                          <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl bg-[#22c55e] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Community tab ── */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div
                className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <MessageSquare className="size-10 mx-auto mb-3 opacity-40" />
                <p>No community posts yet. Be the first!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className={`group relative p-5 rounded-xl border transition-all hover:shadow-lg ${
                      isDark
                        ? 'bg-[#1a1a1a] border-white/10 hover:border-white/20'
                        : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                          isDark
                            ? 'bg-[#22c55e]/20 text-[#22c55e]'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {post.createdBy.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`font-semibold text-sm ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {post.createdBy.name}
                        </div>
                        <div
                          className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                          📍 {post.createdBy.location}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                          post.postType === 'discussion'
                            ? isDark
                              ? 'bg-blue-400/10 text-blue-400'
                              : 'bg-blue-50 text-blue-600'
                            : post.postType === 'watch-party'
                              ? isDark
                                ? 'bg-purple-400/10 text-purple-400'
                                : 'bg-purple-50 text-purple-600'
                              : isDark
                                ? 'bg-amber-400/10 text-amber-400'
                                : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {post.postType === 'discussion'
                          ? '💬 Discussion'
                          : post.postType === 'watch-party'
                            ? '📺 Watch Party'
                            : '✈️ Travel Tip'}
                      </span>
                    </div>

                    <h3
                      className={`font-semibold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed line-clamp-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed ${isDark ? 'border-white/5' : 'border-gray-100'}">
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        <Users className="size-3" />
                        <span>Join discussion</span>
                      </div>
                      <div
                        className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}
                      >
                        {format(new Date(post.createdAt), 'MMM d, h:mm a')}
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl bg-[#22c55e] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Stats tab ── */}
        {activeTab === 'stats' && (
          <div
            className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <TrendingUp className="size-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-1">Statistics coming soon</p>
            <p className="text-sm">
              Team standings, top scorers, and more will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}