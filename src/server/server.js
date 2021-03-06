/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import helmet from 'helmet';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import router from './routes';
import constants from './constants';

dotenv.config();

const app = express();

app.set('key', constants.key);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({}));

if (process.env.NODE_ENV === 'development') {
  console.log('Development config');
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const { publicPath } = webpackConfig.output;
  const serverConfig = { serverSideRender: true, publicPath };
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));

} else {
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
router(app);

app.listen(3000, (err) => {
  if (err) console.log(err);
  console.log(`Example app listening at http://localhost:${3000}`);
});
