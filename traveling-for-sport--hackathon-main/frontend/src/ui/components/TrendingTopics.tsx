import { Hash, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

interface TrendingTopic {
  id: string;
  label: string;
  postCount: number;
  tag: string;
}

const PLACEHOLDER_TOPICS: TrendingTopic[] = [
  { id: '1', label: 'USA vs Brazil Predictions', postCount: 342, tag: 'usa-vs-brazil' },
  { id: '2', label: 'Best Bars in Dallas', postCount: 218, tag: 'dallas-bars' },
  { id: '3', label: 'MetLife Stadium Tips', postCount: 187, tag: 'metlife-tips' },
  { id: '4', label: 'Group Stage Upsets', postCount: 156, tag: 'group-stage-upsets' },
  { id: '5', label: 'Fan Meetups Mexico City', postCount: 134, tag: 'meetups-cdmx' },
  { id: '6', label: 'Travel Visa Questions', postCount: 121, tag: 'visa-help' },
  { id: '7', label: 'Watch Party NYC', postCount: 98, tag: 'watch-party-nyc' },
];

interface TrendingTopicsProps {
  topics?: TrendingTopic[];
  isDark?: boolean;
}

export function TrendingTopics({ topics, isDark = true }: TrendingTopicsProps) {
  const displayTopics = topics && topics.length > 0 ? topics : PLACEHOLDER_TOPICS;

  return (
    <div
      className={`border rounded-xl p-4 ${
        isDark
          ? 'bg-[#1a1a1a] border-white/10'
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className={`size-4 ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`} />
        <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Trending Topics
        </h3>
      </div>

      <div className="space-y-1">
        {displayTopics.map((topic, index) => (
          <Link
            key={topic.id}
            to={`/topics/${topic.tag}`}
            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}
          >
            <span
              className={`text-xs font-bold mt-0.5 min-w-[18px] ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Hash
                  className={`size-3 flex-shrink-0 ${
                    isDark ? 'text-[#22c55e]' : 'text-green-600'
                  }`}
                />
                <span
                  className={`text-sm font-medium truncate ${
                    isDark
                      ? 'text-gray-300 group-hover:text-white'
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`}
                >
                  {topic.label}
                </span>
              </div>
              <span
                className={`text-xs mt-0.5 block ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {topic.postCount} posts
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
