import users from './users';
import scripts from './scripts';
import views from './views';

//import currency from './currency';

const router = (server) => {
  server.use('/api/users', users);
  server.use('/api/scripts', scripts);
  server.use(views);
  //server.use('/api/currency', currency);
};

module.exports = router;
