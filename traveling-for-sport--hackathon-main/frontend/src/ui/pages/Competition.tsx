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
  Shield,
  BookOpen,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { useGetMatchesQuery } from '@/store/apis/matches.api';
import type { RootContext } from '@/ui/Root';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import { SPORT_TEAMS } from '@/ui/pages/Teams';

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

// ── Blog articles per competition ───────────────────────────

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tag: 'guide' | 'city' | 'preview' | 'travel' | 'culture';
  image: string;
}

const TAG_STYLES: Record<BlogArticle['tag'], { label: string; dark: string; light: string }> = {
  guide:   { label: '📖 Guide',   dark: 'bg-blue-400/10 text-blue-400',   light: 'bg-blue-50 text-blue-600' },
  city:    { label: '🏙️ City',    dark: 'bg-amber-400/10 text-amber-400', light: 'bg-amber-50 text-amber-600' },
  preview: { label: '⚽ Preview',  dark: 'bg-green-400/10 text-green-400', light: 'bg-green-50 text-green-700' },
  travel:  { label: '✈️ Travel',   dark: 'bg-purple-400/10 text-purple-400', light: 'bg-purple-50 text-purple-600' },
  culture: { label: '🎭 Culture', dark: 'bg-rose-400/10 text-rose-400',   light: 'bg-rose-50 text-rose-600' },
};

const COMPETITION_BLOG: Record<string, BlogArticle[]> = {
  'fifa-world-cup-2026': [
    { id: 'b1', title: 'The Ultimate Fan Guide to World Cup 2026', excerpt: 'Everything you need to know about attending the first 48-team World Cup — venues, tickets, travel tips, and more across the US, Canada & Mexico.', author: 'Travel for Sport', date: '2026-01-15', readTime: '8 min', tag: 'guide', image: '🗺️' },
    { id: 'b2', title: 'Dallas: Where Southern Hospitality Meets World-Class Football', excerpt: 'AT&T Stadium and the surrounding city offer a unique blend of BBQ, culture, and sports. Here\'s your complete Dallas match-day guide.', author: 'City Desk', date: '2026-01-20', readTime: '6 min', tag: 'city', image: '🤠' },
    { id: 'b3', title: 'New York / New Jersey: The MetLife Experience', excerpt: 'MetLife Stadium will host key Group B and knockout matches. Discover the best ways to reach the stadium, where to stay, and NYC fan zones.', author: 'City Desk', date: '2026-01-22', readTime: '7 min', tag: 'city', image: '🗽' },
    { id: 'b4', title: 'Los Angeles: Sun, Stars, and SoFi Stadium', excerpt: 'From the Hollywood sign to the state-of-the-art SoFi Stadium — LA is ready for the world\'s biggest tournament.', author: 'City Desk', date: '2026-01-25', readTime: '5 min', tag: 'city', image: '🌴' },
    { id: 'b5', title: 'Miami: Heat, Passion, and Hard Rock Stadium', excerpt: 'Group D clashes in the Magic City. Where to eat, party, and soak in the Latin American football atmosphere.', author: 'City Desk', date: '2026-01-28', readTime: '5 min', tag: 'city', image: '🌊' },
    { id: 'b6', title: 'Group A Preview: Can Mexico Thrive on Home Soil?', excerpt: 'Mexico faces Germany in the opener — a rematch of the 2018 shock. We break down every team\'s chances in Group A.', author: 'Tactics Lab', date: '2026-02-01', readTime: '6 min', tag: 'preview', image: '⚽' },
    { id: 'b7', title: 'Group B Preview: USA vs Brazil — The Blockbuster Draw', excerpt: 'The hosts face a five-time champion. Can the USMNT pull off the upset? Plus Serbia and Morocco analysis.', author: 'Tactics Lab', date: '2026-02-03', readTime: '6 min', tag: 'preview', image: '🔥' },
    { id: 'b8', title: 'Toronto: Canada\'s Football Capital Gets a World Cup', excerpt: 'BMO Field and the city of Toronto prepare for their biggest ever sporting moment. Transit, food, and culture highlights.', author: 'City Desk', date: '2026-02-05', readTime: '5 min', tag: 'city', image: '🍁' },
    { id: 'b9', title: 'Mexico City: Estadio Azteca\'s Third World Cup', excerpt: 'The legendary Azteca becomes the first stadium to host three World Cups. Explore the city\'s incredible food scene and match-day traditions.', author: 'City Desk', date: '2026-02-08', readTime: '7 min', tag: 'city', image: '🇲🇽' },
    { id: 'b10', title: 'Flying Between Host Cities: Budget Airline Tips', excerpt: 'With 16 venues across three countries, smart travel planning is key. We compare flight routes, costs, and cross-border logistics.', author: 'Travel for Sport', date: '2026-02-10', readTime: '9 min', tag: 'travel', image: '✈️' },
    { id: 'b11', title: 'Philadelphia: History, Cheesesteaks & the Beautiful Game', excerpt: 'Lincoln Financial Field hosts Group E matches. Dive into Philly\'s best neighborhoods, food, and match-day energy.', author: 'City Desk', date: '2026-02-12', readTime: '5 min', tag: 'city', image: '🔔' },
    { id: 'b12', title: 'Seattle: The Emerald City\'s Football Fever', excerpt: 'Known for its passionate Sounders fans, Seattle and Lumen Field are ready to welcome the world.', author: 'City Desk', date: '2026-02-14', readTime: '5 min', tag: 'city', image: '☕' },
    { id: 'b13', title: 'World Cup Food Guide: What to Eat in Every Host City', excerpt: 'From Texas BBQ to Toronto poutine to Mexico City street tacos — your culinary guide to World Cup 2026.', author: 'Travel for Sport', date: '2026-02-15', readTime: '10 min', tag: 'culture', image: '🍕' },
  ],
  'premier-league': [
    { id: 'pl1', title: 'Premier League 2025-26 Season Preview', excerpt: 'Man City chase a fifth straight title, while Arsenal and Liverpool look to dethrone them. Full season breakdown.', author: 'Tactics Lab', date: '2025-08-10', readTime: '8 min', tag: 'preview', image: '🏴' },
    { id: 'pl2', title: 'London Derby Day: The Complete Fan Guide', excerpt: 'Arsenal vs Tottenham, Chelsea vs West Ham — navigating London\'s pubs, transit, and stadiums on derby day.', author: 'City Desk', date: '2025-09-01', readTime: '6 min', tag: 'city', image: '🏟️' },
    { id: 'pl3', title: 'Manchester: Two Clubs, One Football-Mad City', excerpt: 'Old Trafford and the Etihad — visiting Manchester for the ultimate Premier League experience.', author: 'City Desk', date: '2025-09-15', readTime: '5 min', tag: 'city', image: '🐝' },
    { id: 'pl4', title: 'Visiting Anfield: A First-Timer\'s Guide to Liverpool', excerpt: 'From the Shankly Gates to You\'ll Never Walk Alone — everything you need for an unforgettable Anfield trip.', author: 'City Desk', date: '2025-10-01', readTime: '6 min', tag: 'city', image: '🔴' },
  ],
  'uefa-champions-league': [
    { id: 'ucl1', title: 'Champions League 2025-26: New Format Explained', excerpt: 'The expanded 36-team league phase brings more matches and drama. Here\'s how it all works.', author: 'Tactics Lab', date: '2025-09-10', readTime: '7 min', tag: 'guide', image: '🌟' },
    { id: 'ucl2', title: 'Best European Cities for Away-Day Trips', excerpt: 'From Barcelona to Istanbul — the most fan-friendly cities for Champions League travel.', author: 'Travel for Sport', date: '2025-10-05', readTime: '8 min', tag: 'travel', image: '🌍' },
  ],
  'nba': [
    { id: 'nba1', title: 'NBA 2025-26: Contenders and Pretenders', excerpt: 'The Celtics defend their title while the Thunder, Nuggets and Knicks chase the Larry O\'Brien trophy.', author: 'Tactics Lab', date: '2025-10-15', readTime: '7 min', tag: 'preview', image: '🏀' },
    { id: 'nba2', title: 'Madison Square Garden: The Mecca of Basketball', excerpt: 'A visitor\'s guide to the world\'s most famous arena and everything NYC has to offer on game night.', author: 'City Desk', date: '2025-11-01', readTime: '6 min', tag: 'city', image: '🗽' },
  ],
  'nfl': [
    { id: 'nfl1', title: 'NFL 2025 Season: Super Bowl LX Preview', excerpt: 'Can the Chiefs three-peat? Or will the Eagles, Lions, or Bills finally break through?', author: 'Tactics Lab', date: '2025-09-05', readTime: '7 min', tag: 'preview', image: '🏈' },
    { id: 'nfl2', title: 'Tailgating 101: The Best NFL Parking Lots in America', excerpt: 'From Arrowhead to Lambeau, we rank the top tailgating experiences across the league.', author: 'Travel for Sport', date: '2025-09-10', readTime: '6 min', tag: 'culture', image: '🍖' },
  ],
};

// ── Competition-specific team overrides ─────────────────────
// For tournaments like the World Cup, show national teams instead of club teams.

interface CompTeam {
  name: string;
  badge: string;
  city: string;
  stadium: string;
  founded: number;
  category: string;
}

const COMPETITION_TEAM_OVERRIDES: Record<string, CompTeam[]> = {
  'fifa-world-cup-2026': [
    // Group A
    { name: 'Mexico', badge: '🇲🇽', city: 'Mexico City, Mexico', stadium: 'Estadio Azteca', founded: 1927, category: 'Group A' },
    { name: 'Germany', badge: '🇩🇪', city: 'Frankfurt, Germany', stadium: 'Deutsche Bank Park', founded: 1900, category: 'Group A' },
    { name: 'Ecuador', badge: '🇪🇨', city: 'Quito, Ecuador', stadium: 'Estadio Olímpico Atahualpa', founded: 1925, category: 'Group A' },
    { name: 'Japan', badge: '🇯🇵', city: 'Tokyo, Japan', stadium: 'National Stadium', founded: 1921, category: 'Group A' },
    // Group B
    { name: 'USA', badge: '🇺🇸', city: 'Chicago, IL', stadium: 'Soldier Field', founded: 1913, category: 'Group B' },
    { name: 'Brazil', badge: '🇧🇷', city: 'Rio de Janeiro, Brazil', stadium: 'Maracanã', founded: 1914, category: 'Group B' },
    { name: 'Serbia', badge: '🇷🇸', city: 'Belgrade, Serbia', stadium: 'Rajko Mitić Stadium', founded: 1919, category: 'Group B' },
    { name: 'Morocco', badge: '🇲🇦', city: 'Casablanca, Morocco', stadium: 'Stade Mohammed V', founded: 1956, category: 'Group B' },
    // Group C
    { name: 'England', badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', city: 'London, England', stadium: 'Wembley', founded: 1863, category: 'Group C' },
    { name: 'Spain', badge: '🇪🇸', city: 'Madrid, Spain', stadium: 'Santiago Bernabéu', founded: 1920, category: 'Group C' },
    { name: 'South Korea', badge: '🇰🇷', city: 'Seoul, South Korea', stadium: 'Seoul World Cup Stadium', founded: 1928, category: 'Group C' },
    { name: 'Saudi Arabia', badge: '🇸🇦', city: 'Riyadh, Saudi Arabia', stadium: 'King Fahd Stadium', founded: 1956, category: 'Group C' },
    // Group D
    { name: 'France', badge: '🇫🇷', city: 'Paris, France', stadium: 'Stade de France', founded: 1919, category: 'Group D' },
    { name: 'Argentina', badge: '🇦🇷', city: 'Buenos Aires, Argentina', stadium: 'Estadio Monumental', founded: 1893, category: 'Group D' },
    { name: 'Nigeria', badge: '🇳🇬', city: 'Lagos, Nigeria', stadium: 'Teslim Balogun Stadium', founded: 1945, category: 'Group D' },
    { name: 'Australia', badge: '🇦🇺', city: 'Sydney, Australia', stadium: 'Stadium Australia', founded: 1922, category: 'Group D' },
    // Group E
    { name: 'Netherlands', badge: '🇳🇱', city: 'Amsterdam, Netherlands', stadium: 'Johan Cruyff Arena', founded: 1889, category: 'Group E' },
    { name: 'Portugal', badge: '🇵🇹', city: 'Lisbon, Portugal', stadium: 'Estádio da Luz', founded: 1914, category: 'Group E' },
    { name: 'Canada', badge: '🇨🇦', city: 'Toronto, Canada', stadium: 'BMO Field', founded: 1986, category: 'Group E' },
    { name: 'Senegal', badge: '🇸🇳', city: 'Dakar, Senegal', stadium: 'Stade Abdoulaye Wade', founded: 1960, category: 'Group E' },
    // Group F
    { name: 'Belgium', badge: '🇧🇪', city: 'Brussels, Belgium', stadium: 'King Baudouin Stadium', founded: 1895, category: 'Group F' },
    { name: 'Colombia', badge: '🇨🇴', city: 'Bogotá, Colombia', stadium: 'Estadio El Campín', founded: 1924, category: 'Group F' },
    { name: 'Ghana', badge: '🇬🇭', city: 'Accra, Ghana', stadium: 'Accra Sports Stadium', founded: 1957, category: 'Group F' },
    { name: 'Uruguay', badge: '🇺🇾', city: 'Montevideo, Uruguay', stadium: 'Estadio Centenario', founded: 1900, category: 'Group F' },
    // Group G
    { name: 'Italy', badge: '🇮🇹', city: 'Rome, Italy', stadium: 'Stadio Olimpico', founded: 1898, category: 'Group G' },
    { name: 'Croatia', badge: '🇭🇷', city: 'Zagreb, Croatia', stadium: 'Stadion Maksimir', founded: 1912, category: 'Group G' },
    { name: 'Chile', badge: '🇨🇱', city: 'Santiago, Chile', stadium: 'Estadio Nacional', founded: 1895, category: 'Group G' },
    { name: 'Iran', badge: '🇮🇷', city: 'Tehran, Iran', stadium: 'Azadi Stadium', founded: 1920, category: 'Group G' },
    // Group H
    { name: 'Denmark', badge: '🇩🇰', city: 'Copenhagen, Denmark', stadium: 'Parken Stadium', founded: 1889, category: 'Group H' },
    { name: 'Switzerland', badge: '🇨🇭', city: 'Bern, Switzerland', stadium: 'Wankdorf Stadium', founded: 1895, category: 'Group H' },
    { name: 'Poland', badge: '🇵🇱', city: 'Warsaw, Poland', stadium: 'PGE Narodowy', founded: 1919, category: 'Group H' },
    { name: 'Cameroon', badge: '🇨🇲', city: 'Yaoundé, Cameroon', stadium: 'Stade Ahmadou Ahidjo', founded: 1959, category: 'Group H' },
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
  const [activeTab, setActiveTab] = useState<'matches' | 'teams' | 'blog' | 'posts' | 'stats'>('matches');
  const [blogFilter, setBlogFilter] = useState<BlogArticle['tag'] | 'all'>('all');
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

  // Derive teams: use competition-specific overrides (e.g. national teams for World Cup),
  // otherwise fall back to the sport-level club teams.
  const sportSlug = competition?.sport.toLowerCase().replace(/\s*\(.*\)/, '').replace(/\s+/g, '-') ?? '';
  const competitionTeams = useMemo(() => {
    if (competitionSlug && COMPETITION_TEAM_OVERRIDES[competitionSlug]) {
      return COMPETITION_TEAM_OVERRIDES[competitionSlug];
    }
    const sport = SPORT_TEAMS.find(
      (s) => s.slug === sportSlug || s.label.toLowerCase().startsWith(sportSlug),
    );
    return sport?.teams ?? [];
  }, [competitionSlug, sportSlug]);

  const blogArticles = useMemo(() => {
    const articles = (competitionSlug ? COMPETITION_BLOG[competitionSlug] : null) ?? [];
    if (blogFilter === 'all') return articles;
    return articles.filter((a) => a.tag === blogFilter);
  }, [competitionSlug, blogFilter]);

  const blogTags = useMemo(() => {
    const all = (competitionSlug ? COMPETITION_BLOG[competitionSlug] : null) ?? [];
    return Array.from(new Set(all.map((a) => a.tag)));
  }, [competitionSlug]);

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
                { key: 'teams', label: 'Teams', icon: Shield },
                { key: 'blog', label: 'Blog', icon: BookOpen },
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
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-20 self-start">
          <SportsSidebar isDark={isDark} />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
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

        {/* ── Teams tab ── */}
        {activeTab === 'teams' && (
          <div>
            {competitionTeams.length === 0 ? (
              <div
                className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <Shield className="size-10 mx-auto mb-3 opacity-40" />
                <p>No team data available for this competition yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {competitionTeams.map((team) => (
                  <div
                    key={team.name}
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
                        <p
                          className={`text-xs ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          {team.category}
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Blog tab ── */}
        {activeTab === 'blog' && (
          <div>
            {/* Tag filter pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <button
                onClick={() => setBlogFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  blogFilter === 'all'
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
              {blogTags.map((tag) => {
                const style = TAG_STYLES[tag];
                return (
                  <button
                    key={tag}
                    onClick={() => setBlogFilter(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      blogFilter === tag
                        ? isDark
                          ? style.dark
                          : style.light
                        : isDark
                          ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    {style.label}
                  </button>
                );
              })}
            </div>

            {blogArticles.length === 0 ? (
              <div
                className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <BookOpen className="size-10 mx-auto mb-3 opacity-40" />
                <p>No blog articles available yet for this competition.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {blogArticles.map((article) => {
                  const tagStyle = TAG_STYLES[article.tag];
                  return (
                    <article
                      key={article.id}
                      className={`group relative rounded-xl border p-5 transition-all hover:shadow-lg cursor-pointer ${
                        isDark
                          ? 'bg-[#1a1a1a] border-white/10 hover:border-white/20'
                          : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div
                          className={`shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-3xl ${
                            isDark ? 'bg-white/5' : 'bg-gray-50'
                          }`}
                        >
                          {article.image}
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Tag + read time */}
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                isDark ? tagStyle.dark : tagStyle.light
                              }`}
                            >
                              {tagStyle.label}
                            </span>
                            <span
                              className={`flex items-center gap-1 text-xs ${
                                isDark ? 'text-gray-500' : 'text-gray-400'
                              }`}
                            >
                              <Clock className="size-3" />
                              {article.readTime}
                            </span>
                          </div>

                          {/* Title */}
                          <h3
                            className={`font-bold text-sm mb-1 line-clamp-1 group-hover:text-[#22c55e] transition-colors ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {article.title}
                          </h3>

                          {/* Excerpt */}
                          <p
                            className={`text-xs leading-relaxed line-clamp-2 ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className={`flex items-center justify-between mt-4 pt-3 border-t border-dashed ${
                          isDark ? 'border-white/5' : 'border-gray-100'
                        }`}
                      >
                        <div
                          className={`text-xs ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          By <span className="font-medium">{article.author}</span> · {format(new Date(article.date), 'MMM d, yyyy')}
                        </div>
                        <div
                          className={`flex items-center gap-1 text-xs font-medium ${
                            isDark
                              ? 'text-gray-500 group-hover:text-[#22c55e]'
                              : 'text-gray-400 group-hover:text-green-600'
                          } transition-colors`}
                        >
                          Read more
                          <ExternalLink className="size-3" />
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl bg-[#22c55e] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </article>
                  );
                })}
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
    </div>
  );
}