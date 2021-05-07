'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Avatar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Avatar.init({
    filename: {
      type: DataTypes.STRING,
      allowNull:false
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull:false
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull:false
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull:false
    }
  }, {
    sequelize,
    tableName: 'avatar_images',
    modelName: 'Avatar',
  });
  return Avatar;
};