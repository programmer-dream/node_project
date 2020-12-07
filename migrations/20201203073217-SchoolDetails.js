'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('SchoolDetails', {
      SchoolVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      WebsiteURL: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
      },
      Address: {
        allowNull: false,
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
      AuthenticationType: {
        type: Sequelize.ENUM('OTP', 'thirdparty','captcha','checkbox')
      },
      SchoolSecretTokenKey: {
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
     await queryInterface.dropTable('SchoolDetails');
  }
};
