'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vls_video_services', {
      video_service_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      video_service_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      video_account_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      no_of_licenses: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      Base_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Settings: {
        type: Sequelize.STRING,
        allowNull: false
      },
      services_enabled: {
        type: Sequelize.STRING,
        allowNull: false
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
