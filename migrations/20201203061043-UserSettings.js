'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('UserSettings', {
      userSettingsVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      FeedbackSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      LearningLibrarySuport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      videoLibrarySupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      AssignmentSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      chatSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      CommunityChatSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      RewardsAndRecognitionSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      NotificationSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      AlertSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      MailboxSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      ERPSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      StudentReport: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      LearningLibraryPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      videoLibraryPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      AssignmentPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      chatPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      CommunityChatPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      RewardsAndRecognitionPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      NotificationPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      AlertPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      MailboxPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      ERPPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
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
     await queryInterface.dropTable('UserSettings');
  }
};
