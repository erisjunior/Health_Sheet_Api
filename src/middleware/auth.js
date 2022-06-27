const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const tokenString =
    req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

  if (!tokenString) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const token = tokenString.split(' ')[1];

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = verifyToken;
