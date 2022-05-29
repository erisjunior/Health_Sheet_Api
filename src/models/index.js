const Sequelize = require('sequelize');
const UserModel = require('./user.model');
const ProcedureModel = require('./procedure.model');

const dialectOptions = process.env.APP_URL === 'localhost:8080' ? {} : {
  encrypt: true,
  ssl: {
    rejectUnauthorized: false
  }
};

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/healthsheetdb', {
  ssl: true,
  dialectOptions: dialectOptions,
});

const User = sequelize.define('user', UserModel);
const Procedure = sequelize.define('procedure', ProcedureModel);

User.hasMany(Procedure);
Procedure.belongsTo(User);

const db = {};

db.sequelize = sequelize;

db.users = User;
db.procedures = Procedure;

module.exports = db;
