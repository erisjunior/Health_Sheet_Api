const router = require('express').Router();
const multer = require('multer');

const procedures = require('../controllers/procedure.controller.js');
const multerConfig = require('../config/multer.js');

module.exports = app => {
  router.get('/', procedures.findAll);

  router.get('/:id', procedures.find);

  router.post('/', multer(multerConfig).single('file'), procedures.create);

  router.put('/:id', multer(multerConfig).single('file'), procedures.update);

  router.delete('/:id', procedures.delete);

  app.use('/procedures', router);
};
