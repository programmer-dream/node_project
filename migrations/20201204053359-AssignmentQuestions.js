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
      assignmentQuestionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assignmentVlsId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      questionType: {
        allowNull: false,
        type: Sequelize.ENUM('Form','Choice','MultipleChecklist','Offline')
      },
      question: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      choice1: {
        type: Sequelize.STRING
      },
      choice2: {
        type: Sequelize.STRING
      },
      choice3: {
        type: Sequelize.STRING
      },
      choice4: {
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
