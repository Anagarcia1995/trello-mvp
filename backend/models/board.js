'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Board.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "owner",
      });

      Board.belongsToMany(models.User, {
        through: models.BoardUser,
        foreignKey:"boardId",
        otherKey: "userId",
        as: "members",
      });

      Board.hasMany(models.Task, {
        foreignKey: "boardId",
        as: "tasks",
      });
    }
  }
  Board.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};