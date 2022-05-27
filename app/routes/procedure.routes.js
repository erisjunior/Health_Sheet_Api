module.exports = app => {
  const procedures = require('../controllers/procedure.controller.js');
  const upload = require('../services/upload');

  const router = require('express').Router();

  router.get('/', procedures.findAll);

  router.get('/:id', procedures.findOne);

  router.post('/', upload.single('file'), procedures.create);

  router.put('/:id', procedures.update);

  router.delete('/', procedures.deleteAll);

  app.use('/procedures', router);
};
