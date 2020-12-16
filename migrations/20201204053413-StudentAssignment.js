'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('student_assignment', {
      student_assignment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assignment_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assignment_status: {
        type: Sequelize.ENUM('New','Inprogress','Submitted','ValidationInprogress','Approved','Rejected','Closed')
      },
      submission_date: {
        type: Sequelize.DATE
      },
      assessment: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.STRING
      },
      followup_assignment_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER 
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
     await queryInterface.dropTable('student_assignment');
  }
};
