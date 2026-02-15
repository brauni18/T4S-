import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { useGetMatchByIdQuery } from '@/store/apis/matches.api';
import { useAppSelector } from '@/store/hooks';
import { useState } from 'react';
import { useParams, Link } from 'react-router';

export function Match() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((store) => store.user);
  const { data, isLoading, error } = useGetMatchByIdQuery(id!);
  
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    postType: 'discussion' as 'discussion' | 'meetup' | 'watch-party'
  });

  if (isLoading) return <div className="p-8 text-white">Loading match details...</div>;
  if (error || !data) return <div className="p-8 text-red-400">Error loading match</div>;

  const { match, forumPosts } = data;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/home">
          <Button variant="ghost" className="mb-4 text-gray-400 hover:text-white hover:bg-white/5">
            ← Back to Matches
          </Button>
        </Link>

        <Card className="mb-8 bg-[#1a1a1a] border border-white/15">
          <CardHeader className="text-center bg-[#22c55e]/20 border-b border-white/10">
            <CardTitle className="text-3xl mb-2 text-white">
              {match.homeTeam} 🆚 {match.awayTeam}
            </CardTitle>
            <p className="text-lg text-gray-400">{match.stage}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-300">
              <div className="space-y-3">
                <div>📅 <strong className="text-white">Date:</strong> {new Date(match.date).toLocaleDateString()}</div>
                <div>🕐 <strong className="text-white">Time:</strong> {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="space-y-3">
                <div>🏟️ <strong className="text-white">Venue:</strong> {match.venue}</div>
                <div>📍 <strong className="text-white">City:</strong> {match.city}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-[#1a1a1a] border border-white/15">
          <CardHeader>
            <CardTitle className="text-xl text-white">🤝 Connect with Fan Communities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center border-white/20 text-white hover:bg-white/5">
                <span className="text-2xl mb-2">🏟️</span>
                <span className="font-semibold">Official Fan Clubs</span>
                <span className="text-sm text-gray-500">Team supporters</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center border-white/20 text-white hover:bg-white/5">
                <span className="text-2xl mb-2">✈️</span>
                <span className="font-semibold">Travel Groups</span>
                <span className="text-sm text-gray-500">Organize trips</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center border-white/20 text-white hover:bg-white/5">
                <span className="text-2xl mb-2">📺</span>
                <span className="font-semibold">Watch Parties</span>
                <span className="text-sm text-gray-500">Local viewing</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-white/15">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-white">💬 Fan Forum ({forumPosts.length})</CardTitle>
            <Button onClick={() => setShowCreatePost(!showCreatePost)} className="bg-[#22c55e] hover:bg-[#1ea34e] text-black">
              {showCreatePost ? 'Cancel' : '+ New Post'}
            </Button>
          </CardHeader>
          <CardContent>
            {showCreatePost && (
              <div className="mb-6 p-4 border border-white/15 rounded-xl bg-[#0f0f0f]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Post Type</label>
                    <select
                      className="w-full p-2 border border-white/15 rounded-lg bg-[#1a1a1a] text-white"
                      value={newPost.postType}
                      onChange={(e) => setNewPost({ ...newPost, postType: e.target.value as 'discussion' | 'meetup' | 'watch-party' })}
                    >
                      <option value="discussion">💬 Discussion</option>
                      <option value="meetup">🤝 Meetup</option>
                      <option value="watch-party">📺 Watch Party</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Title</label>
                    <input
                      className="w-full p-2 border border-white/15 rounded-lg bg-[#1a1a1a] text-white placeholder:text-gray-500"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="What's your post about?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Content</label>
                    <textarea
                      className="w-full p-2 border border-white/15 rounded-lg bg-[#1a1a1a] text-white placeholder:text-gray-500 h-24"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Share your thoughts, plans, or questions..."
                    />
                  </div>
                  <Button disabled={!newPost.title || !newPost.content} className="bg-[#22c55e] hover:bg-[#1ea34e] text-black">
                    Post to Forum
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {forumPosts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No posts yet. Be the first to start the conversation!
                </p>
              ) : (
                forumPosts.map((post) => (
                  <div key={post._id} className="border border-white/15 rounded-xl p-4 bg-[#0f0f0f]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center text-black text-sm font-semibold">
                          {post.createdBy.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-white">{post.createdBy.name}</div>
                          <div className="text-xs text-gray-500">
                            {post.createdBy.location && `📍 ${post.createdBy.location}`}
                            {post.createdBy.favoriteTeams.length > 0 && ` • 🏆 ${post.createdBy.favoriteTeams.join(', ')}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${post.postType === 'discussion' ? 'bg-[#22c55e]/20 text-[#22c55e]' : post.postType === 'meetup' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {post.postType === 'discussion' ? '💬' : post.postType === 'meetup' ? '🤝' : '📺'} {post.postType}
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 text-white">{post.title}</h3>
                    <p className="text-gray-400">{post.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}