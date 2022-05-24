const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/healthsheetdb', {
  ssl: true,
  dialectOptions: {
    // encrypt: true,
    // ssl: {
    //   rejectUnauthorized: false
    // }
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model.js')(sequelize, Sequelize);
db.procedures = require('./procedure.model.js')(sequelize, Sequelize);

module.exports = db;
