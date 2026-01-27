'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.Board, {
        foreignKey: "boardId",
        as: "board",
      });
    }
  }
  Task.init({
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "todo",
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};