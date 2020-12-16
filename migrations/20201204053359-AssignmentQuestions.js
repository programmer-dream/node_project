'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('assignment_questions', {
      assignment_question_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      student_vls_id: {
        type: Sequelize.INTEGER
      },
      assignment_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      question_type: {
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
      next_assignment_question_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
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
     await queryInterface.dropTable('assignment_questions');
  }
};
