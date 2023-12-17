'use strict';
const {
  Model
} = require('sequelize');
const models = require('./index');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Post.belongsToMany(models.Comments, {
      //   through: "PostComments",
      //   foreignKey: 'post_id',
      //   as: 'post_comments'
      // });

      
    }
  }
  Post.init({
    post_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    post: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Post',
  },
  Post.associate = (models) => {
    Post.belongsToMany(models.Comments, {
      through: "PostComments",
        foreignKey: 'post_id',
        as: 'post_comments'
    });
  }

    
  );
  return Post;

};



