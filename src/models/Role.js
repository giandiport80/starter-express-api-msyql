'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Role extends Model {
  static associate(models) {
    Role.hasOne(models.Product, {
      foreignKey: 'role_id',
      as: 'user',
    });
  }
}

Role.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Role',
    tableName: 'roles',
    timestamps: false,
    underscored: false,
  }
);

module.exports = Role;
