'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
  static associate(models) {
    User.hasMany(models.Product, {
      foreignKey: 'userId',
      as: 'products',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_telp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remember_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    underscored: false,
  }
);

module.exports = User;
