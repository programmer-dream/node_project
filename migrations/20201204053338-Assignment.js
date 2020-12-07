'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('Assignment', {
      AssignmentVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      AssignmentClassId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      AssignmentDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      AssignmentCompletionDate: {
        type: Sequelize.ENUM('Online','Offline')
      },
      AssignmentType: {
        type: Sequelize.STRING
      },
      RootAssignmentQuestionId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      NoOfAssignmentsSubmitted: {
        type: Sequelize.STRING
      },
      NoOfAssignmentsRejected: {
        type: Sequelize.STRING
      },
      AssignmentLevel: {
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
     await queryInterface.dropTable('Assignment');
  }
};
