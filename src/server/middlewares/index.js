import { validationResult } from 'express-validator';

import { UserModel } from '../db';

export const validateRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }
  next();
};

export const userExist = async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not exist' });
  next();
};
