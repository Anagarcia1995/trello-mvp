'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Board, {
        foreignKey: "ownerId",
        as: "ownedBoards",
      });

      User.belongsToMany(models.Board, {
        through: models.BoardUser,
        foreignKey: "userId",
        otherKey: "boardId",
        as: "sharedBoards",
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};