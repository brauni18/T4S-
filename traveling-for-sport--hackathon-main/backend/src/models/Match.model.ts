import { Schema, model, type HydratedDocument } from 'mongoose';

type MatchProps = {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  stage: string;
  venue: string;
  city: string;
};

export type MatchDocument = HydratedDocument<MatchProps>;

const MatchSchema = new Schema<MatchProps>(
  {
    homeTeam: { type: String, required: true, trim: true },
    awayTeam: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    stage: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const MatchModel = model<MatchProps>('Match', MatchSchema);