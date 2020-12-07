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
      BranchVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SchoolId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      BranchName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Contact1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Contact2: {
        type: Sequelize.STRING
      },
      Contact3: {
        type: Sequelize.STRING
      },
      EmailId1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      EmailId2: {
        type: Sequelize.STRING
      },
      Notes: {
        type: Sequelize.STRING
      },
      Ratings: {
        type: Sequelize.STRING
      },
      AssessmentSystem: {
        type: Sequelize.STRING
      },
      AssessmentScheme: {
        type: Sequelize.STRING
      },
      AssessmentVlsId: {
        type: Sequelize.STRING
      },
      NoOfWorkingDays: {
        type: Sequelize.STRING
      },
      FeedbackSupport: {
        type: Sequelize.BOOLEAN
      },
      LearningLibrarySuport: {
        type: Sequelize.ENUM('SMS', 'Email', 'Both')
      },
      videoLibrarySupport: {
        type: Sequelize.BOOLEAN
      },
      AssignmentSupport: {
        type: Sequelize.BOOLEAN
      },
      chatSupport: {
        type: Sequelize.BOOLEAN
      },
      CommunityChatSupport: {
        type: Sequelize.BOOLEAN
      },
      RewardsAndRecognitionSupport: {
        type: Sequelize.BOOLEAN
      },
      NotificationSupport: {
        type: Sequelize.BOOLEAN
      },
      AlertSupport: {
        type: Sequelize.BOOLEAN
      },
      MailboxSupport: {
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
