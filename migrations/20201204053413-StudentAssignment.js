'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('StudentAssignment', {
      studentAssignmentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assignmetVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assignmentStatus: {
        type: Sequelize.ENUM('New','Inprogress','Submitted','ValidationInprogress','Approved','Rejected','Closed')
      },
      submissionDate: {
        type: Sequelize.DATE
      },
      assessment: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.STRING
      },
      followupAssignmentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER 
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
     await queryInterface.dropTable('StudentAssignment');
  }
};
