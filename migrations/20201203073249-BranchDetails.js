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
        type: Sequelize.INTEGER
      },
      BranchName: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      Contact1: {
        type: Sequelize.STRING
      },
      Contact2: {
        type: Sequelize.STRING
      },
      Contact3: {
        type: Sequelize.STRING
      },
      EmailId1: {
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
        type: Sequelize.STRING
      },
      LearningLibrarySuport: {
        type: Sequelize.ENUM('SMS', 'Email', 'Both')
      },
      videoLibrarySupport: {
        type: Sequelize.STRING
      },
      AssignmentSupport: {
        type: Sequelize.STRING
      },
      chatSupport: {
        type: Sequelize.STRING
      },
      CommunityChatSupport: {
        type: Sequelize.STRING
      },
      RewardsAndRecognitionSupport: {
        type: Sequelize.STRING
      },
      NotificationSupport: {
        type: Sequelize.STRING
      },
      AlertSupport: {
        type: Sequelize.STRING
      },
      MailboxSupport: {
        type: Sequelize.STRING
      },
      ERPSupport: {
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
     await queryInterface.dropTable('BranchDetails');
  }
};
