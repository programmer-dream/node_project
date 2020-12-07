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
      StudentAssignmentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      StudentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      AssignmetVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      AssignmentStatus: {
        type: Sequelize.ENUM('New','Inprogress','Submitted','ValidationInprogress','Approved','Rejected','Closed')
      },
      SubmissionDate: {
        type: Sequelize.DATE
      },
      Assessment: {
        type: Sequelize.STRING
      },
      Comments: {
        type: Sequelize.STRING
      },
      FollowupAssignmentVlsId: {
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
