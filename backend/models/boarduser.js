"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BoardUser extends Model {
    static associate(models) {
      BoardUser.belongsTo(models.User, { foreignKey: "userId" });
      BoardUser.belongsTo(models.Board, { foreignKey: "boardId" });
    }
  }

  BoardUser.init(
    {
      boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BoardUser",
      indexes: [
        // La constraint única real ya está en la migración.
        { unique: true, fields: ["boardId", "userId"] },
      ],
    }
  );

  return BoardUser;
};
