module.exports = app => {
  const users = require('../controllers/user.controller.js');

  const router = require('express').Router();

  router.get('/', users.findAll);

  router.get('/:id', users.find);

  router.post('/', users.create);

  router.put('/:id', users.update);

  router.delete('/:id', users.delete);

  app.use('/users', router);
};
