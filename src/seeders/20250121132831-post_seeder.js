'use strict';
const Post = require('../models/Post');

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
    await Post.bulkCreate([
      {
        user_id: 1,
        title: 'Post 1',
        description: 'Description post 1',
      },
      {
        user_id: 1,
        title: 'Post 2',
        description: 'Description post 2',
      },
      {
        user_id: 1,
        title: 'Post 3',
        description: 'Description post 3',
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
    await queryInterface.bulkDelete('posts', null, {});
  },
};
