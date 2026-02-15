export interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  stage: string;
  venue: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchWithPosts {
  match: Match;
  forumPosts: ForumPost[];
}

export interface ForumPost {
  _id: string;
  createdBy: {
    _id: string;
    name: string;
    location: string;
    favoriteTeams: string[];
  };
  title: string;
  content: string;
  matchId: string;
  postType: 'discussion' | 'meetup' | 'watch-party';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostBody {
  createdBy: string;
  title: string;
  content: string;
  matchId?: string;
  postType?: 'discussion' | 'meetup' | 'watch-party';
}