'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Authentication', {
      AuthVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      SchoolVlsId: {
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        type: Sequelize.INTEGER
      },
      userType: {
        type: Sequelize.ENUM('Student','Faculty','Parent','Admin')
      },
      userVlsId: {
        type: Sequelize.INTEGER
      },
      oldPassword1: {
        allowNull: true,
        type: Sequelize.STRING
      },
      oldPassword2: {
        allowNull: true,
        type: Sequelize.STRING
      },
      oldPassword3: {
        allowNull: true,
        type: Sequelize.STRING
      },
      PasswordCriteria: {
        allowNull: true,
        type: Sequelize.STRING
      },
      userSettingsVlsId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      RecoveryEmailId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      PasswordResetType: {
        allowNull: true,
        type: Sequelize.ENUM('OTP', 'PasswordResetLink')
      },
      RecoveryContactNo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      AutenticationType: {
        allowNull: true,
        type: Sequelize.ENUM('OTP', 'Captcha','Checkbox','thirdParty')
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
     await queryInterface.dropTable('Authentication');
  }
};
