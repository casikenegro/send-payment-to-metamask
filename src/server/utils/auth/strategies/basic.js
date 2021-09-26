import passport from 'passport';
import bcrypt from 'bcrypt';
import { BasicStrategy } from 'passport-http';

import { generateToken } from '../..';
import { UserModel } from '../../../db';

passport.use(
  new BasicStrategy(async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) return done(null, false, { message: 'forbidden' });
      if (await bcrypt.compare(password, user.password)) {
        delete user.password;
        const payload = {
          ...user._doc,
          token: generateToken(user._id),
        };
        return done(null, payload);
      }
      return done(error, false);
    } catch (error) {
      return done(error, false);
    }
  }),
);
