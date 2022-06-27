const authMiddleware = require('../middleware/auth');

module.exports = app => {
  const users = require('../controllers/user.controller.js');

  const router = require('express').Router();

  router.post('/login', users.login);

  router.post('/register/', users.register);

  router.put('/users', authMiddleware, users.update);

  router.delete('/users', authMiddleware, users.delete);

  app.use(router);
};
