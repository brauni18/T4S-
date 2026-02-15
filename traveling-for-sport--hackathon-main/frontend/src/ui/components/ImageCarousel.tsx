import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images?: string[];
  isDark?: boolean;
}

const PLACEHOLDER_IMAGES = [
  { id: 1, label: 'Stadium Atmosphere', gradient: 'from-green-700 to-green-900' },
  { id: 2, label: 'Away Day Travel', gradient: 'from-emerald-600 to-teal-800' },
  { id: 3, label: 'Matchday Meetups', gradient: 'from-teal-700 to-cyan-900' },
  { id: 4, label: 'Fan Culture', gradient: 'from-cyan-700 to-blue-900' },
  { id: 5, label: 'World Cup 2026', gradient: 'from-green-600 to-emerald-800' },
  { id: 6, label: 'Tailgate Parties', gradient: 'from-lime-700 to-green-900' },
];

export function ImageCarousel({ images, isDark = true }: ImageCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const hasRealImages = images && images.length > 0;

  // Duplicate items so the scroll can loop seamlessly
  const items = hasRealImages
    ? [...images, ...images]
    : [...PLACEHOLDER_IMAGES, ...PLACEHOLDER_IMAGES];

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
        {items.map((item, index) =>
          hasRealImages ? (
            <img
              key={index}
              src={item as string}
              alt=""
              className="h-44 w-72 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div
              key={index}
              className={`h-44 w-72 rounded-xl flex-shrink-0 bg-gradient-to-br ${
                (item as (typeof PLACEHOLDER_IMAGES)[0]).gradient
              } flex items-end p-4 border ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}
            >
              <span className="text-white font-semibold text-sm drop-shadow">
                {(item as (typeof PLACEHOLDER_IMAGES)[0]).label}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
