'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reactions.init({
    reaction_id: DataTypes.STRING,
    post_id: DataTypes.UUID,
    reaction: DataTypes.ENUM('like', 'dislike', 'love', 'funny'),
    user_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Reactions',
  });
  return Reactions;
};