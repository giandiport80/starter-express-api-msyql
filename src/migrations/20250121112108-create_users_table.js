'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_unicode_ci',
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        collate: 'utf8mb4_unicode_ci',
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        collate: 'utf8mb4_unicode_ci',
      },
      email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_unicode_ci',
      },
      no_telp: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb4_unicode_ci',
      },
      image: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb4_unicode_ci',
      },
      remember_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb4_unicode_ci',
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
      },
    });

    await queryInterface.addIndex('users', {
      fields: ['email'],
      unique: true,
      name: 'users_email_unique',
      using: 'BTREE',
    });

    await queryInterface.addIndex('users', {
      fields: ['username'],
      unique: true,
      name: 'users_username_unique',
      using: 'BTREE',
    });

    await queryInterface.addIndex('users', {
      fields: ['role_id'],
      name: 'users_role_id_foreign',
      using: 'BTREE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
