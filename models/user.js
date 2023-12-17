'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    surname: DataTypes.STRING,
    othernames: DataTypes.STRING,
    email_address: DataTypes.STRING,
    user_id: DataTypes.UUID,
    username: DataTypes.STRING,
    occupation: DataTypes.STRING,
    about_me: DataTypes.TEXT,
    password_hash: DataTypes.STRING,
    password_salt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};