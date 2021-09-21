import users from './users';
import scripts from './scripts';

const router = (server) => {
  server.use('api/users', users);
  server.use('api/scripts', scripts);
};

module.exports = router;
