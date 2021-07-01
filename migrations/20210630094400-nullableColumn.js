'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vls_video_services', 'Settings', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('vls_video_services', 'services_enabled', {
                type: Sequelize.STRING
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
