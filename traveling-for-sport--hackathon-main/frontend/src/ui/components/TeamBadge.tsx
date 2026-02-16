/**
 * Renders a team / country badge.
 *
 * - If `badge` is a 2-3 letter ISO country code (e.g. "us", "gb-eng") → renders
 *   a flag PNG from flagcdn.com.
 * - Otherwise it's treated as an emoji and rendered as text.
 *
 * Usage:
 *   <TeamBadge badge="us" size={28} />        → 🇺🇸 flag image
 *   <TeamBadge badge="gb-eng" size={28} />    → 🏴󠁧󠁢󠁥󠁮󠁧󠁿 flag image
 *   <TeamBadge badge="🔴" size={28} />        → emoji
 */

/** Returns true when the badge value is a flag‑CDN country code */
export function isFlagCode(badge: string): boolean {
  return /^[a-z]{2}(-[a-z]{2,4})?$/i.test(badge);
}

/** Builds a flagcdn.com PNG URL for the given code */
export function flagUrl(code: string, width = 80): string {
  // flagcdn uses lowercase codes; sub-region flags (gb-eng) map to a /w80/ URL
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}

interface TeamBadgeProps {
  badge: string;
  size?: number;
  className?: string;
}

export function TeamBadge({ badge, size = 28, className = '' }: TeamBadgeProps) {
  if (isFlagCode(badge)) {
    return (
      <img
        src={flagUrl(badge, size <= 20 ? 40 : 80)}
        alt={badge.toUpperCase()}
        width={size}
        height={Math.round(size * 0.75)}
        className={`inline-block object-cover rounded-sm ${className}`}
        loading="lazy"
      />
    );
  }
  return <span className={className}>{badge}</span>;
}
