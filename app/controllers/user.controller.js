const db = require('../models');
const User = db.users;

exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving users.'
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
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
  User.create(req.body)
    .then(data => {
      res.send({
        message: 'User was created successfully!',
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

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'User was updated successfully.'
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
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all dogs.'
      });
    });
};

