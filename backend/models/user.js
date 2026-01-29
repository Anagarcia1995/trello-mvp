"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Boards creados por este usuario (propietario técnico del board)
      User.hasMany(models.Board, {
        foreignKey: "ownerId",
        as: "ownedBoards",
      });

      // Boards donde este usuario es miembro (compartidos por email)
      User.belongsToMany(models.Board, {
        through: models.BoardUser,
        foreignKey: "userId",
        otherKey: "boardId",
        as: "sharedBoards",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // La constraint real está en migración (unique: true).
        // Esto es validación a nivel modelo para fallar antes.
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
