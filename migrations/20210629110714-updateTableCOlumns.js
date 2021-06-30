'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('school_meeting_settings', 'video_service_id', {
                type: Sequelize.INTEGER
      });
      await queryInterface.removeColumn('vls_video_services', 'school_vls_id');
      await queryInterface.removeColumn('vls_video_services', 'branch_vls_id');

  },

  down: async (queryInterface, Sequelize) => {
    
     
  }
};
