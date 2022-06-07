'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('branch_details', 'video_services_enabled', {
                type: Sequelize.ENUM('no','yes')
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
