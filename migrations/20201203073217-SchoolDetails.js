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
      schoolVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      websiteURL: {
        type: Sequelize.STRING
      },
      description: {
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
      feedbackSupport: {
        type: Sequelize.STRING
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
      authenticationType: {
        type: Sequelize.ENUM('OTP', 'thirdparty','captcha','checkbox')
      },
      schoolSecretTokenKey: {
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
