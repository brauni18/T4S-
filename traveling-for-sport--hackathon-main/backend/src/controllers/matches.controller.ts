import type { Request, Response } from 'express';
import { MatchModel } from '../models/Match.model.js';
import { PostModel } from '../models/Post.model.js';
import type { ObjectIdParams } from '../types/common.types.js';

// READ all matches (grouped by stage)
export async function listMatches(req: Request, res: Response) {
  try {
    const matches = await MatchModel.find()
      .sort({ date: 1 }) // Sort by date ascending
      .exec();

    return res.json(matches);
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
}

// READ one match with associated forum posts
export async function getMatchById(req: Request, res: Response) {
  try {
    const { id } = req.params as ObjectIdParams;

    const match = await MatchModel.findById(id);
    if (!match) return res.status(404).json({ message: 'match not found' });

    // Get forum posts for this match
    const forumPosts = await PostModel.find({ matchId: id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name location favoriteTeams')
      .exec();

    return res.json({
      match,
      forumPosts,
    });
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
}

// CREATE match (mainly for seeding)
export async function createMatch(req: Request, res: Response) {
  try {
    const { homeTeam, awayTeam, date, stage, venue, city } = req.body;

    const match = await MatchModel.create({
      homeTeam,
      awayTeam,
      date,
      stage,
      venue,
      city,
    });

    return res.status(201).json(match);
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
}