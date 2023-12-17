'use strict';
const {
  Model
} = require('sequelize');
const models = require('./index');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comments.belongsTo(models.Post, {
        foreignKey: 'post_id',
        as: 'post_comments'
      })
    }
  }
  Comments.init({
    comment_id: DataTypes.UUID,
    post_id: DataTypes.UUID,
    comments: DataTypes.STRING,
    user_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};