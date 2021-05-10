'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('avatars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      },
      userId:{
        allowNull: false,
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('avatars');
  }
};