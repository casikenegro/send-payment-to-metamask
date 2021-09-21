import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import boom from '@hapi/boom';
import axios from 'axios';
import config from '../../../config/index';

passport.use(
  new BasicStrategy((async (email, password, cb) => {
    try {
      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-in`,
        method: 'post',
        auth: {
          password,
          username: email,
        },
        data: {
          apiKeyToken: config.apiKeyToken,
        },
      });

      if (!data || status !== 200) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, data);
    } catch (error) {
      cb(error);
    }
  })),
);
