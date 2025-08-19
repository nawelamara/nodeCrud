import { Request, Response } from 'express';
import User from '../models/userJson';

export const createUserJson = async (req: Request, res: Response) => {
  const { data } = req.body;
  const user = await User.create({ data });
  res.json(user);
};

export const getUsersJson = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

export const getUserJson = async (req: Request, res: Response) => {

  const user = await User.findByPk(req.params.id);
  if (user) res.json(user);
  else res.status(404).send('User not found');
};

export const updateUserJson = async (req: Request, res: Response) => {
  const { data } = req.body;
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update({ data });
    res.json(user);
  } else res.status(404).send('User not found');
};

export const deleteUserJson = async (req: Request, res: Response) => {

  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.sendStatus(204);
  } else res.status(404).send('User not found');
};
