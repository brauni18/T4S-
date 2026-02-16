import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import type { ObjectIdParams } from '../types/common.types.js';

export function validateMatchId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params as ObjectIdParams;

  if (!id) return res.status(400).json({ message: 'id is required' });
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'id is not a valid ObjectId' });
  }

  return next();
}