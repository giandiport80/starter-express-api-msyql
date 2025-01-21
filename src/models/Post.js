'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Post extends Model {
  static associate(models) {
    Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

Post.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: false,
    underscored: false,
  }
);

module.exports = Post;
