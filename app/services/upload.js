const multer = require('multer');

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
      cb(null, 'uploads/')
  },
  filename: (_, file, cb) => {
      const fileExtension = file.originalname.split('.')[1];

      const fileNewName = require('crypto')
          .randomBytes(64)
          .toString('hex');

      cb(null, `${fileNewName}.${fileExtension}`)
  }
});

const upload = multer({ storage });

module.exports = upload;
