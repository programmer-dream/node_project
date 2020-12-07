'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('Recognition', {
      RecognitionVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      StudentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TeacherVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Subject: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
      },
      Date: {
        type: Sequelize.DATE
      },
      Rating: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('Recognition');
  }
};
