const db = require('../models');
const User = db.users;

const formatHealthInfoToDatabase = (healthInfo = {}) => {
  if (healthInfo) {
    if (typeof healthInfo === 'string') {
      try {
        JSON.parse(healthInfo);
      } catch (error) {
        throw new Error('Medical Info must be an object');
      }
    } else {
      healthInfo = JSON.stringify(healthInfo);
    }
  }

  return healthInfo;
}

const formatHealthInfoToResponse = (healthInfo = "") => {
  return JSON.parse(healthInfo);
}

exports.findAll = async (req, res) => {
  try {
    const response = await User.findAll();

    const users = response.map(user => ({
      ...user.dataValues,
      health_info: formatHealthInfoToResponse(user.dataValues.health_info),
    }));

    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while retrieving users.' });
  }
};

exports.find = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await User.findByPk(id);

    const user = {...response.dataValues, health_info: formatHealthInfoToResponse(response.dataValues.health_info)};

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || `Error retrieving user with id=${id}` });
  }
};

exports.create = async (req, res) => {
  try {
    const healthInfo = formatHealthInfoToDatabase(req.body.health_info);

    const response = await User.create({ ...req.body, health_info: healthInfo });

    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error creating user' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const healthInfo = formatHealthInfoToDatabase(req.body.health_info);

    const response = await User.update({ ...req.body, health_info: healthInfo }, { where: { id } })

    if (response == 1) {
      res.send({ message: 'User was updated successfully.' });
    } else {
      res.send({ message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || `Error updating user with id=${id}` });
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

