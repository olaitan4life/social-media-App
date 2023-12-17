'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      reaction_id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      post_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Posts',
          key: 'post_id'
        }
      },
      reaction: {
        type: Sequelize.ENUM('like', 'dislike', 'love', 'funny'),
        defaultValue: null
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reactions');
  }
};