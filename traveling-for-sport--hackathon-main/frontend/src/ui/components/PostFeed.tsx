import type { ForumPost } from '@/types/match.type';
import { MessageSquare, MapPin, Tv, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: ForumPost;
  isDark: boolean;
}

const POST_TYPE_CONFIG = {
  discussion: {
    icon: MessageSquare,
    label: 'Discussion',
    darkColor: 'text-blue-400',
    darkBg: 'bg-blue-400/10',
    lightColor: 'text-blue-600',
    lightBg: 'bg-blue-50',
  },
  meetup: {
    icon: MapPin,
    label: 'Meetup',
    darkColor: 'text-[#22c55e]',
    darkBg: 'bg-[#22c55e]/10',
    lightColor: 'text-green-600',
    lightBg: 'bg-green-50',
  },
  'watch-party': {
    icon: Tv,
    label: 'Watch Party',
    darkColor: 'text-purple-400',
    darkBg: 'bg-purple-400/10',
    lightColor: 'text-purple-600',
    lightBg: 'bg-purple-50',
  },
} as const;

function PostCard({ post, isDark }: PostCardProps) {
  const typeConfig = POST_TYPE_CONFIG[post.postType];
  const TypeIcon = typeConfig.icon;

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
    } catch {
      return '';
    }
  })();

  return (
    <article
      className={`border rounded-xl p-5 transition-colors ${
        isDark
          ? 'bg-[#1a1a1a] border-white/10 hover:border-white/20'
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
      }`}
    >
      {/* Post header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
            isDark
              ? 'bg-[#22c55e]/20 text-[#22c55e]'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {post.createdBy.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {post.createdBy.name}
            </span>
            {post.createdBy.location && (
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                📍 {post.createdBy.location}
              </span>
            )}
          </div>
          <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Clock className="size-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Post type badge */}
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isDark
              ? `${typeConfig.darkColor} ${typeConfig.darkBg}`
              : `${typeConfig.lightColor} ${typeConfig.lightBg}`
          }`}
        >
          <TypeIcon className="size-3" />
          {typeConfig.label}
        </span>
      </div>

      {/* Post content */}
      <h3 className={`font-semibold text-base mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {post.title}
      </h3>
      <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {post.content}
      </p>

      {/* Favorite teams */}
      {post.createdBy.favoriteTeams.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {post.createdBy.favoriteTeams.map((team) => (
            <span
              key={team}
              className={`px-2 py-0.5 rounded-full text-xs ${
                isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {team}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

// Placeholder post data for development
const PLACEHOLDER_POSTS: ForumPost[] = [
  {
    _id: 'p1',
    createdBy: { _id: 'u1', name: 'Carlos M.', location: 'Mexico City', favoriteTeams: ['Mexico', 'Argentina'] },
    title: 'Anyone traveling to Dallas for the group stage?',
    content: 'Looking for fellow fans going to the Mexico vs. Germany match in Dallas. Would love to organize a pre-game meetup, maybe grab some tacos and watch the earlier games together!',
    matchId: 'm1',
    postType: 'meetup',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: 'p2',
    createdBy: { _id: 'u2', name: 'Sarah K.', location: 'London', favoriteTeams: ['England'] },
    title: 'Watch party in NYC for England matches',
    content: 'Organizing a watch party at a British pub in Manhattan for all England group stage matches. DM me if interested — spaces are limited!',
    matchId: 'm2',
    postType: 'watch-party',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: 'p3',
    createdBy: { _id: 'u3', name: 'Takeshi Y.', location: 'Tokyo', favoriteTeams: ['Japan', 'Brazil'] },
    title: 'Japan vs Brazil — will this be the upset of the tournament?',
    content: 'Japan has been on fire in recent friendlies and Brazil hasn\'t looked their best. I genuinely think Japan could pull this off. What do you all think?',
    matchId: 'm3',
    postType: 'discussion',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: 'p4',
    createdBy: { _id: 'u4', name: 'Ahmed R.', location: 'Casablanca', favoriteTeams: ['Morocco', 'France'] },
    title: 'Best accommodation near MetLife Stadium?',
    content: 'I\'m flying in from Morocco for the group games at MetLife. Any recommendations for affordable hotels or Airbnbs nearby? Preferably with good transport links.',
    matchId: 'm4',
    postType: 'discussion',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

interface PostFeedProps {
  posts?: ForumPost[];
  isDark?: boolean;
}

export function PostFeed({ posts, isDark = true }: PostFeedProps) {
  const displayPosts = posts && posts.length > 0 ? posts : PLACEHOLDER_POSTS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Feed</h2>
        <div className="flex gap-2">
          {(['All', 'Discussion', 'Meetup', 'Watch Party'] as const).map((filter, i) => (
            <button
              key={filter}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                i === 0
                  ? isDark
                    ? 'bg-[#22c55e]/15 text-[#22c55e]'
                    : 'bg-green-100 text-green-700'
                  : isDark
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {displayPosts.map((post) => (
        <PostCard key={post._id} post={post} isDark={isDark} />
      ))}
    </div>
  );
}
