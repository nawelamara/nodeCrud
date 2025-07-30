import { Request, Response } from 'express';
import User from '../models/user';

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await User.create({ name, email });
  res.json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {

  const user = await User.findByPk(req.params.id);
  if (user) res.json(user);
  else res.status(404).send('User not found');
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update({ name, email });
    res.json(user);
  } else res.status(404).send('User not found');
};

export const deleteUser = async (req: Request, res: Response) => {

  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.sendStatus(204);
  } else res.status(404).send('User not found');
};
