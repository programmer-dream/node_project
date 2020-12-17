'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      auth_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_name: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      school_id: {
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      user_vls_id: {
        type: Sequelize.BIGINT
      },
      old_passwords: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      password_criteria: {
        allowNull: true,
        type: Sequelize.STRING
      },
      user_settings_vls_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      recovery_email_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      password_reset_type: {
        allowNull: true,
        type: Sequelize.ENUM('OTP', 'PasswordResetLink')
      },
      recovery_contact_no: {
        allowNull: true,
        type: Sequelize.STRING
      },
      autentication_type: {
        allowNull: true,
        type: Sequelize.ENUM('OTP', 'Captcha','Checkbox','thirdParty')
      },
      last_login: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vls_session_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      erp_session_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      session_expiry: {
        allowNull: true,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
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
     await queryInterface.dropTable('users');
  }
};
