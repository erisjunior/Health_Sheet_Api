const db = require('../models');
const User = db.users;

exports.findAll = async (req, res) => {
  try {
    const response = await User.findAll();

    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while retrieving users.' });
  }
};

exports.find = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await User.findByPk(id);

    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error retrieving user with id=' + id });
  }
};

exports.create = async (req, res) => {
  try {
    const response = await User.create(req.body);

    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error creating user' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await User.update(req.body, { where: { id } })

    if (response == 1) {
      res.send({ message: 'User was updated successfully.' });
    } else {
      res.send({ message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error updating user with id=' + id });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await User.destroy({ where: { id }, truncate: false });

    if (response == 1) {
      res.send({ message: 'User was deleted successfully.' });
    } else {
      res.send({ message: `Cannot delete user with id=${id}. Maybe user was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while removing this user.' });
  }
};

