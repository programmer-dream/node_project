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
      assignmentVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assignmentClassId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      assignmentDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      assignmentCompletionDate: {
        type: Sequelize.ENUM('Online','Offline')
      },
      assignmentType: {
        type: Sequelize.STRING
      },
      rootAssignmentQuestionId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      noOfAssignmentsSubmitted: {
        type: Sequelize.STRING
      },
      noOfAssignmentsRejected: {
        type: Sequelize.STRING
      },
      assignmentLevel: {
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
