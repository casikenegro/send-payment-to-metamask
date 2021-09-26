import express from 'express';
import { UserModel, ScriptModel } from '../../db';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/dashboard/:username', async (req, res) => {
  try {
    const user = await UserModel.findOne({ where: { username: req.params.username } });
    const scripts = await ScriptModel.find({ user: user._id });
    return res.render('dashboard', { user: {
      ...user._doc,
      scripts,
    } });
  } catch (error) {
    return res.render('500');
  }
});

export default router;
