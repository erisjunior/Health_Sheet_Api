module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    telephone: {
      type: Sequelize.STRING
    },
    cpf: {
      type: Sequelize.STRING
    },
    birthday: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
  });

  return User;
};
