const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const db = require('../models');

const Procedure = db.procedures;
const User = db.users;

const s3 = new aws.S3();

const userInclude = { model: User, as: 'user' }

const removeFile = async (fileKey) => {
  if (process.env.STORAGE_TYPE === 's3') {
    await s3.deleteObject({
      Bucket: 'health-sheet',
      Key: fileKey
    }).promise();
  } else {
    await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'temp', 'uploads', fileKey))
  }
}

exports.findAll = async (req, res) => {
  try {
    const { userId } = req.query;
    let where = {};

    if (userId) {
      where = { ...where, 'userId': userId };
    }

    const response = await Procedure.findAll({
      where,
      include: [userInclude],
    });

    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error   occurred while retrieving procedures.' });
  }
};

exports.find = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Procedure.findByPk(id, {
      include: [userInclude],
    });
    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message || `Error retrieving procedure with id=${id}` });
  }
};

exports.create = async (req, res) => {
  let file = null;
  let fileKey = null;

  try {
    if (!req.body.userId) {
      return res.status(400).send({ message: 'User id is required' });
    }

    if (req.file) {
      fileKey = req.file.key;

      file = req.file.location || `${process.env.APP_URL}/files/${fileKey}`;
    }

    const response = await Procedure.create({ ...req.body, file, fileKey });
    res.send(response);
  } catch (err) {
    await removeFile(fileKey);

    let errorMessage = err.message || 'Error creating procedure'

    if (err.original.constraint === 'procedures_userId_fkey') {
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

    if (req.file) {
      fileKey = req.file.key;

      file = req.file.location || `${process.env.APP_URL}/files/${fileKey}`;

      const procedure = await Procedure.findByPk(id);
      await removeFile(procedure.fileKey);
    }

    const response = await Procedure.update({ ...req.body, file, fileKey }, { where: { id } });

    if (response == 1) {
      res.send({ message: 'Procedure was updated successfully.' });
    } else {
      res.send({ message: `Cannot update procedure with id=${id}. Maybe procedure was not found or req.body is empty!` });
    }
  } catch (err) {
    await removeFile(fileKey);

    let errorMessage = err.message || `Error updating procedure with id=${id}`

    if (err.original.constraint === 'procedures_userId_fkey') {
      errorMessage = 'User does not exist.'
    }

    res.status(500).send({ message: errorMessage });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const procedure = await Procedure.findByPk(id);

    const response = await Procedure.destroy({ where: { id }, truncate: false })

    if (response == 1) {
      await removeFile(procedure.fileKey);

      res.send({ message: 'Procedure was deleted successfully.' });
    } else {
      res.send({ message: `Cannot delete procedure with id=${id}. Maybe procedure was not found!` });
    }

  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while removing this procedure.' });
  }
};

