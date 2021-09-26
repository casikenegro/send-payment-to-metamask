import bcrypt from 'bcrypt';
import url from 'url';

import { UserModel, ScriptModel, ButtonModel } from '../../db';

import * as utils from '../../utils';

const { Script } = require('../../utils');

//users controllers

export const get = async (req, res) => {
  try {
    const user = await UserModel.find();
    return res.json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getOneUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    const scripts = await ScriptModel.find({ user: user._id });
    return res.json({
      ...user._doc,
      scripts,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const user = await UserModel.findOne({ where: { email: req.body.email } });
    if (!user) return res.render('login');;
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.redirect(url.format({
        pathname: `/dashboard/${user.username}`,
      }));
    }
    return res.render('login');;
  } catch (error) {
    return res.render('500');
  }
};

export const signUp = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    await UserModel.create({ ...req.body });
    return res.render('login');
  } catch (error) {
    return res.render('500');
  }
};

export const update = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    user.set({ ...req.body });
    await user.save();
    return res.status(200).json({ message: 'success', user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User does not exist' });
    }
    await ScriptModel.deleteMany({ user: user._id });
    await user.delete();
    return res.status(200).json({ message: 'user successfully deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// users - scripts

export const userCreateScript = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    const userScript = new Script({ ...req.body });
    const script = await ScriptModel.create({ ...userScript, user: user._id });
    return res.status(200).json({ message: 'success', ...script._doc });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const userDeleteScript = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    const script = await ScriptModel.findById(req.params.script_id);
    if (!script) return res.status(404).json({ message: 'script not found' });
    await script.delete();
    return res.status(200).json({ message: 'successfully deleted' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// users - button

export const getButtons = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    const button = await ButtonModel.find({ user: user._id });
    if (!button) return res.status(404).json({ message: 'button not found' });
    return res.status(200).json({ message: 'button found', ...button });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const createButton = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    const script = await ScriptModel.findOne({ user: req.body.script_id });
    if (!script) return res.status(404).json({ message: 'script not found' });
    const button = await ButtonModel.create({
      ...req.body,
      buttonScript: utils.generateButton(req.body.type, req.body.color, req.body.value),
      user: user._id,
      scripts: script._id,
    });
    return res.status(200).json({ message: 'button successfully created', ...button._doc });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const deleteButton = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    const button = await ButtonModel.findById(req.params.button_id);
    if (!button) return res.status(404).json({ message: 'button not found' });
    await button.delete();
    return res.status(200).json({ message: 'successfully deleted' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
