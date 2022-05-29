const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const destination = path.resolve(__dirname, '..', '..', 'temp', 'uploads');

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination)
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, file.key);
      })
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'health-sheet',
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, file.key);
      })
    },
    // contentType: multerS3.AUTO_CONTENT_TYPE,
  })
}

module.exports = {
  dest: destination,
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: { fileSize: 10 * 1024 * 1024 }
};
