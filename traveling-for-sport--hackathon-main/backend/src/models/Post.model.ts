import { Schema, model, Types, type HydratedDocument } from 'mongoose';

type Post = {
  createdBy: Types.ObjectId;
  title: string;
  content: string;
  matchId?: Types.ObjectId;
  postType: 'discussion' | 'meetup' | 'watch-party';
};

export type PostType = HydratedDocument<Post>;

const PostSchema = new Schema<Post>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', index: true },
    postType: { type: String, enum: ['discussion', 'meetup', 'watch-party'], default: 'discussion' },
  },
  { timestamps: true },
);

export const PostModel = model<Post>('Post', PostSchema);
