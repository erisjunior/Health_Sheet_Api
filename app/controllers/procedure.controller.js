const db = require('../models');

const Procedure = db.procedures;
const User = db.users;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  Procedure.findAll({
    include: [{
      model: User,
      as: 'user',
    }],
    order: [['createdAt', 'DESC']],
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving procedures.'
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Procedure.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving procedure with id=' + id
      });
    });
};

exports.create = (req, res) => {
  Procedure.create({ ...req.body, file: req.file.filename })
    .then(data => {
      res.send({
        message: 'Procedure was created successfully!',
        data
      })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error creating procedure'
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Procedure.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Procedure was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update procedure with id=${id}. Maybe procedure was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating procedure with id=' + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Procedure.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} procedures were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all dogs.'
      });
    });
};

