'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('BranchDetails', {
      branchVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      schoolId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branchName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      contact3: {
        type: Sequelize.STRING
      },
      emailId1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      emailId2: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      ratings: {
        type: Sequelize.STRING
      },
      assessmentSystem: {
        type: Sequelize.STRING
      },
      assessmentScheme: {
        type: Sequelize.STRING
      },
      assessmentVlsId: {
        type: Sequelize.STRING
      },
      noOfWorkingDays: {
        type: Sequelize.STRING
      },
      feedbackSupport: {
        type: Sequelize.BOOLEAN
      },
      learningLibrarySuport: {
        type: Sequelize.ENUM('SMS', 'Email', 'Both')
      },
      videoLibrarySupport: {
        type: Sequelize.BOOLEAN
      },
      assignmentSupport: {
        type: Sequelize.BOOLEAN
      },
      chatSupport: {
        type: Sequelize.BOOLEAN
      },
      communityChatSupport: {
        type: Sequelize.BOOLEAN
      },
      rewardsAndRecognitionSupport: {
        type: Sequelize.BOOLEAN
      },
      notificationSupport: {
        type: Sequelize.BOOLEAN
      },
      alertSupport: {
        type: Sequelize.BOOLEAN
      },
      mailboxSupport: {
        type: Sequelize.BOOLEAN
      },
      ERPSupport: {
        type: Sequelize.BOOLEAN
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
     await queryInterface.dropTable('BranchDetails');
  }
};
