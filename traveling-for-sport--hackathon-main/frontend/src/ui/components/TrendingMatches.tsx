import type { Match } from '@/types/match.type';
import { useGetMatchesQuery } from '@/store/apis/matches.api';
import { useAppSelector } from '@/store/hooks';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { Link } from 'react-router';
import { format } from 'date-fns';

interface MatchItemProps {
  match: Match;
  highlighted?: boolean;
  isDark: boolean;
}

function MatchItem({ match, highlighted, isDark }: MatchItemProps) {
  const formattedDate = (() => {
    try {
      return format(new Date(match.date), 'MMM d, yyyy');
    } catch {
      return match.date;
    }
  })();

  return (
    <Link
      to={`/matches/${match._id}`}
      className={`block p-3 rounded-lg border transition-colors cursor-pointer ${
        highlighted
          ? isDark
            ? 'border-[#22c55e]/30 bg-[#22c55e]/5 hover:border-[#22c55e]/50'
            : 'border-green-300 bg-green-50 hover:border-green-400'
          : isDark
          ? 'border-white/5 bg-white/[0.02] hover:border-white/20'
          : 'border-gray-100 bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {match.homeTeam} vs {match.awayTeam}
        </span>
      </div>
      <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3" />
          {match.city}
        </span>
      </div>
      {match.stage && (
        <span
          className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium ${
            isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {match.stage}
        </span>
      )}
    </Link>
  );
}

const PLACEHOLDER_MATCHES: Match[] = [
  { _id: '1', homeTeam: 'Mexico', awayTeam: 'Germany', date: '2026-06-11T18:00:00Z', stage: 'Group A', venue: 'AT&T Stadium', city: 'Dallas', createdAt: '', updatedAt: '' },
  { _id: '2', homeTeam: 'USA', awayTeam: 'Brazil', date: '2026-06-12T20:00:00Z', stage: 'Group B', venue: 'MetLife Stadium', city: 'New York', createdAt: '', updatedAt: '' },
  { _id: '3', homeTeam: 'England', awayTeam: 'Japan', date: '2026-06-13T16:00:00Z', stage: 'Group C', venue: 'SoFi Stadium', city: 'Los Angeles', createdAt: '', updatedAt: '' },
  { _id: '4', homeTeam: 'France', awayTeam: 'Argentina', date: '2026-06-14T20:00:00Z', stage: 'Group D', venue: 'Hard Rock Stadium', city: 'Miami', createdAt: '', updatedAt: '' },
  { _id: '5', homeTeam: 'Spain', awayTeam: 'Netherlands', date: '2026-06-15T18:00:00Z', stage: 'Group E', venue: 'Lincoln Financial Field', city: 'Philadelphia', createdAt: '', updatedAt: '' },
  { _id: '6', homeTeam: 'Canada', awayTeam: 'Morocco', date: '2026-06-16T16:00:00Z', stage: 'Group F', venue: 'BMO Field', city: 'Toronto', createdAt: '', updatedAt: '' },
  { _id: '7', homeTeam: 'Portugal', awayTeam: 'South Korea', date: '2026-06-17T18:00:00Z', stage: 'Group G', venue: 'Estadio Azteca', city: 'Mexico City', createdAt: '', updatedAt: '' },
  { _id: '8', homeTeam: 'Belgium', awayTeam: 'Nigeria', date: '2026-06-18T20:00:00Z', stage: 'Group H', venue: 'Lumen Field', city: 'Seattle', createdAt: '', updatedAt: '' },
];

interface TrendingMatchesProps {
  isDark?: boolean;
}

export function TrendingMatches({ isDark = true }: TrendingMatchesProps) {
  const { data: apiMatches } = useGetMatchesQuery();
  const favoriteTeams = useAppSelector((store) => store.user.favoriteTeams);

  const allMatches = apiMatches && apiMatches.length > 0 ? apiMatches : PLACEHOLDER_MATCHES;

  const sortedMatches = [...allMatches]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const myTeamMatches = allMatches
    .filter((m) => favoriteTeams.some((t) => m.homeTeam === t || m.awayTeam === t))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Upcoming matches */}
      <div
        className={`border rounded-xl p-4 ${
          isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy className={`size-4 ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`} />
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Matches
          </h3>
        </div>
        <div className="space-y-2">
          {sortedMatches.map((match) => (
            <MatchItem key={match._id} match={match} isDark={isDark} />
          ))}
        </div>
      </div>

      {/* My team's matches */}
      <div
        className={`border rounded-xl p-4 ${
          isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className={isDark ? 'text-[#22c55e]' : 'text-green-600'}>⭐</span>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Team's Matches
          </h3>
        </div>
        {myTeamMatches.length > 0 ? (
          <div className="space-y-2">
            {myTeamMatches.map((match) => (
              <MatchItem key={match._id} match={match} highlighted isDark={isDark} />
            ))}
          </div>
        ) : (
          <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {favoriteTeams.length > 0
              ? 'No upcoming matches for your teams'
              : 'Select favorite teams to see their matches'}
          </p>
        )}
      </div>
    </div>
  );
}
