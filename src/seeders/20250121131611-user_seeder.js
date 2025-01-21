'use strict';
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await User.bulkCreate([
      {
        role_id: 1,
        name: 'Superadmin',
        username: 'superadmin',
        email: 'superadmin@gmail.com',
        password: await bcrypt.hash('123456', 10),
      },
      {
        role_id: 2,
        name: 'Admin',
        username: 'admin',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('123456', 10),
      },
      {
        role_id: 3,
        name: 'User',
        username: 'user',
        email: 'user@gmail.com',
        password: await bcrypt.hash('123456', 10),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
