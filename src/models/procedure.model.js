const Sequelize = require('sequelize');

module.exports = {
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
  file_key: {
    type: Sequelize.STRING
  }
};
