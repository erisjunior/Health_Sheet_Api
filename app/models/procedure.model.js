module.exports = (sequelize, Sequelize, User) => {
  const Procedure = sequelize.define('procedure', {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    file: {
      type: Sequelize.STRING
    },
  });

  Procedure.hasOne(User)

  return Procedure;
};
