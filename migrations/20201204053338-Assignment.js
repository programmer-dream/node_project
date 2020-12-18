'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('assignment', {
      assignment_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      student_vls_id: {
        type: Sequelize.INTEGER
      },
      assignment_class_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      assignment_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      assignment_completion_date: {
        type: Sequelize.ENUM('Online','Offline')
      },
      assignment_type: {
        type: Sequelize.STRING
      },
      root_assignment_question_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      no_of_assignments_submitted: {
        type: Sequelize.STRING
      },
      no_of_assignments_rejected: {
        type: Sequelize.STRING
      },
      assignment_level: {
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
     await queryInterface.dropTable('assignment');
  }
};
