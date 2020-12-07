'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('AssignmentQuestions', {
      AssignmentQuestionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      AssignmentVlsId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      QuestionType: {
        allowNull: false,
        type: Sequelize.ENUM('Form','Choice','MultipleChecklist','Offline')
      },
      Question: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
      },
      Choice1: {
        type: Sequelize.STRING
      },
      Choice2: {
        type: Sequelize.STRING
      },
      Choice3: {
        type: Sequelize.STRING
      },
      Choice4: {
        type: Sequelize.STRING
      },
      nextAssignmentQuestionId: {
        allowNull: false,
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
     await queryInterface.dropTable('AssignmentQuestions');
  }
};
