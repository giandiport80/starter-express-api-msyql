'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb4_unicode_ci',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb4_unicode_ci',
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
        collate: 'latin1_swedish_ci',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('posts', {
      fields: ['user_id'],
      name: 'posts_user_id_foreign',
      using: 'BTREE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  },
};
