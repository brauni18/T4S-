import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { useGetMatchesQuery } from '@/store/apis/matches.api';
import { format } from 'date-fns';
import type { Match } from '@/types/match.type';

interface UpcomingMatchesCarouselProps {
  isDark?: boolean;
}

// Placeholder matches data
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

export function UpcomingMatchesCarousel({ isDark = true }: UpcomingMatchesCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: apiMatches } = useGetMatchesQuery();

  const allMatches = apiMatches && apiMatches.length > 0 ? apiMatches : PLACEHOLDER_MATCHES;
  
  // Sort by date and get upcoming matches
  const upcomingMatches = [...allMatches]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10); // Show top 10 upcoming matches

  // Duplicate matches for seamless infinite scroll
  const extendedMatches = [...upcomingMatches, ...upcomingMatches];

  // Continuous slow scroll — 0.08px per frame for a very gentle drift
  useEffect(() => {
    let animationId: number;
    const container = scrollRef.current;
    if (!container) return;

    const step = () => {
      if (!isPaused && container) {
        container.scrollLeft += 0.08;
        // Loop: when halfway (duplicate content), reset
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const formatMatchDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d');
    } catch {
      return dateString;
    }
  };

  const formatMatchTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left fade */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-[#0f0f0f] to-transparent'
            : 'bg-gradient-to-r from-gray-100 to-transparent'
        }`}
      />
      {/* Right fade */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-l from-[#0f0f0f] to-transparent'
            : 'bg-gradient-to-l from-gray-100 to-transparent'
        }`}
      />

      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full
          opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark
              ? 'bg-black/60 hover:bg-black/80 text-white'
              : 'bg-white/80 hover:bg-white text-gray-800 shadow'
          }`}
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full
          opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark
              ? 'bg-black/60 hover:bg-black/80 text-white'
              : 'bg-white/80 hover:bg-white text-gray-800 shadow'
          }`}
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden py-2 px-4 scroll-smooth"
      >
        {extendedMatches.map((match, index) => (
          <Link
            key={`${match._id}-${index}`}
            to={`/matches/${match._id}`}
            className={`block h-44 w-72 rounded-xl flex-shrink-0 p-5 border cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
              isDark 
                ? 'bg-[#1a1a1a] border-white/10 hover:border-white/20' 
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
            }`}
          >
            {/* Stage badge */}
            <div className="flex justify-between items-start mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDark 
                    ? 'bg-[#22c55e]/15 text-[#22c55e]' 
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {match.stage}
              </span>
              <div className={`text-right text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div>{formatMatchDate(match.date)}</div>
                <div>{formatMatchTime(match.date)}</div>
              </div>
            </div>

            {/* Teams */}
            <div className="flex-1 flex flex-col justify-center">
              <div className={`text-center mb-2 font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {match.homeTeam}
                <div className="text-sm font-normal text-gray-500 my-1">vs</div>
                {match.awayTeam}
              </div>
            </div>

            {/* Venue info */}
            <div className={`flex items-center justify-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <MapPin className="size-3" />
              <span>{match.city}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
