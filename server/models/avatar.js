'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class avatar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User , { foreignKey : 'userId' , as: 'user'})
    }
  };
  avatar.init({
    filename: { 
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    filepath: { 
      type: DataTypes.STRING,
      allowNull:false
    },
    mimetype:{ 
      type: DataTypes.STRING,
      allowNull:false
    },
    size: { 
      type: DataTypes.BIGINT,
      allowNull:false
    },
  }, {
    sequelize,
    tableName: 'avatars',
    modelName: 'avatar',
  });
  return avatar;
};