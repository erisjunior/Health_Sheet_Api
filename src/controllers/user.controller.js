const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../models');
const User = db.users;

const formatHealthInfoToDatabase = (healthInfo = {}) => {
  if (healthInfo && healthInfo !== '') {
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

exports.register = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Email and password required!' });
    }

    const oldUser = await User.findOne({ where: { email: req.body.email } });

    if (oldUser) {
      return res.status(400).send({ message: 'Email already used!' });
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const healthInfo = formatHealthInfoToDatabase(req.body.health_info);

    const user = await User.create({ ...req.body, password, health_info: healthInfo });

    delete user.dataValues.password;

    user.dataValues.token = jwt.sign({ userId: user.dataValues.id, email: user.dataValues.email }, process.env.TOKEN_KEY, { expiresIn: "10h" })

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password required!' });
    }

    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res.status(404).send({ message: 'User not found.' });
    }

    if (!(await bcrypt.compare(password, foundUser.password))) {
      return res.status(400).send({ message: 'Invalid credentials.' });
    }

    delete foundUser.dataValues.password;

    foundUser.dataValues.token = jwt.sign({ userId: foundUser.dataValues.id, email: foundUser.dataValues.email }, process.env.TOKEN_KEY, { expiresIn: "10h" })

    const user = {...foundUser.dataValues, health_info: formatHealthInfoToResponse(foundUser.dataValues.health_info)};

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || `Error retrieving user with id=${id}` });
  }
};

exports.update = async (req, res) => {
  try {
    const { userId } = req.user;

    if (req.body.health_info) {
      req.body.health_info = formatHealthInfoToDatabase(req.body.health_info);
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const response = await User.update(req.body, { where: { id: userId } })

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
    const { userId } = req.user;

    const response = await User.destroy({ where: { id: userId }, truncate: false });

    if (response == 1) {
      res.send({ message: 'User was deleted successfully.' });
    } else {
      res.send({ message: `Cannot delete user with id=${id}. Maybe user was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while removing this user.' });
  }
};

