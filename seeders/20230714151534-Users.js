'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
    await queryInterface.bulkInsert('Users', [
      {
      user_id: uuidv4(),
      surname: 'John',
      othernames: ' Doe Ayodeji',
      email_address: 'johndeji@gmail.com',
      username: 'johndeji',
      password_hash: '$2b$10$VA4L9Cl7QZ8wNKyilryRJupsx.UtZK/mv7tEujv5PNG...',
      password_salt: '$2b$10$VA4L9Cl7QZ8wNKyilryRJu'
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
