'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BoardUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BoardUser.belongsTo(models.User, { foreignKey: "userId" });
      BoardUser.belongsTo(models.Board, { foreignKey: "boardId" });
    }
  }
  BoardUser.init({
    boardId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BoardUser',
  });
  return BoardUser;
};