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
      feedbackSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      learningLibrarySuport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      videoLibrarySupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      assignmentSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      chatSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      communityChatSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      rewardsAndRecognitionSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      notificationSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      alertSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      mailboxSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      ERPSupport: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      studentReport: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      learningLibraryPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      videoLibraryPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      assignmentPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      chatPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      communityChatPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      rewardsAndRecognitionPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      notificationPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      alertPermission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      mailboxPermission: {
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
