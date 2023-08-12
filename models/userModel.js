const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    Name : Sequelize.STRING,
    Email : {
       type:Sequelize.STRING,
       unique: true,
    },
    Password : Sequelize.STRING,
    isPremiumUser: Sequelize.BOOLEAN,
    totalExpenses : {
      type : Sequelize.INTEGER,
      defaultValue : 0,
    }
});

module.exports = User;