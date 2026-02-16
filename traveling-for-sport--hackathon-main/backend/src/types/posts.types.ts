export type CreatePostBody = {
  createdBy: string;
  title: string;
  content: string;
  matchId?: string;
  postType?: 'discussion' | 'meetup' | 'watch-party';
};

export type UpdatePostBody = {
  title: string;
  content: string;
};
