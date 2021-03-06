const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const db = require('../models');

const Procedure = db.procedures;
const User = db.users;

const s3 = new aws.S3();

const removeFile = async (fileKey) => {
  if (!fileKey) return;
  if (process.env.STORAGE_TYPE === 's3') {
    await s3.deleteObject({
      Bucket: 'health-sheet',
      Key: fileKey
    }).promise();
  } else {
    await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'temp', 'uploads', fileKey));
  }
}

exports.findAll = async (req, res) => {
  try {
    const { type, category } = req.query;
    const { userId } = req.user;

    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    const procedures = await Procedure.findAll({
      where,
      include: [{ model: User, as: 'user' }],
    });

    res.send(procedures);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error   occurred while retrieving procedures.' });
  }
};

exports.find = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const procedure = await Procedure.findByPk(id, {
      include: [{ model: User, as: 'user', where: { id: userId } }],
    });

    if (!procedure) {
      return res.status(404).send({ message: 'Procedure not found.' });
    }

    res.send(procedure);
  } catch (err) {
    res.status(500).send({ message: err.message || `Error retrieving procedure with id=${id}` });
  }
};

exports.create = async (req, res) => {
  let file = null;
  let fileKey = null;

  try {
    const { userId } = req.user;
    if (!req.body.userId && !userId) {
      return res.status(400).send({ message: 'User id is required' });
    }

    if (req.file) {
      fileKey = req.file.key;

      file = req.file.location || `${process.env.APP_URL}/files/${fileKey}`;
    }

    const procedure = await Procedure.create({ ...req.body, userId: req.body.userId || userId, file, file_key: fileKey });
    res.send(procedure);
  } catch (err) {
    await removeFile(fileKey);

    let errorMessage = err.message || 'Error creating procedure'

    if (err.original?.constraint === 'procedures_userId_fkey') {
      errorMessage = 'User does not exist.'
    }

    res.status(500).send({ message: errorMessage });
  }
};

exports.update = async (req, res) => {
  let file = null;
  let fileKey = null;

  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (req.file) {
      fileKey = req.file.key;

      file = req.file.location || `${process.env.APP_URL}/files/${fileKey}`;

      const procedure = await Procedure.findByPk(id);
      await removeFile(procedure.fileKey);
    }

    const response = await Procedure.update({ ...req.body, file, file_key: fileKey }, { where: { id, userId } });

    if (response == 1) {
      res.send({ message: 'Procedure was updated successfully.' });
    } else {
      res.send({ message: `Cannot update procedure with id=${id}. Maybe procedure was not found or req.body is empty!` });
    }
  } catch (err) {
    await removeFile(fileKey);

    let errorMessage = err.message || `Error updating procedure with id=${id}`

    if (err.original?.constraint === 'procedures_userId_fkey') {
      errorMessage = 'User does not exist.'
    }

    res.status(500).send({ message: errorMessage });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const procedure = await Procedure.findByPk(id);

    const response = await Procedure.destroy({ where: { id, userId }, truncate: false })

    if (response == 1) {
      await removeFile(procedure.file_key);

      res.send({ message: 'Procedure was deleted successfully.' });
    } else {
      res.send({ message: `Cannot delete procedure with id=${id}. Maybe procedure was not found!` });
    }

  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while removing this procedure.' });
  }
};

