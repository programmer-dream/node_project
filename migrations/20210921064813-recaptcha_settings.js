'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('recaptcha_settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      site_key: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      secret_key: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      is_enabled: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue:0
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
    
  }
};
