/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import router from './routes';
import constants from './constants';

dotenv.config();
const app = express();
if (process.env.SERVER === 'development') {
  console.log('Development config');
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const { publicPath } = webpackConfig.output;
  const serverConfig = { serverSideRender: true, publicPath };
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));

}
app.set('key', constants.key);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router(app);

app.listen(3000, (err) => {
  if (err) console.log(err);
  console.log(`Example app listening at http://localhost:${3000}`);
});
