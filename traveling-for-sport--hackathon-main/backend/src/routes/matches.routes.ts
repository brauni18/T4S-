import { Router } from 'express';
import {
  createMatch,
  getMatchById,
  listMatches,
} from '../controllers/matches.controller.js';
import { validateMatchId } from '../validators/matches.validator.js';

export const matchesRouter = Router();

matchesRouter.get('/', listMatches);
matchesRouter.get('/:id', validateMatchId, getMatchById);
matchesRouter.post('/', createMatch);