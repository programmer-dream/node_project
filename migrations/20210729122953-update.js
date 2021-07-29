'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vls_meetings', 'api_video_service_id', {
                type: Sequelize.BIGINT
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
