'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('school_meeting_settings', 'api_key');
      await queryInterface.removeColumn('school_meeting_settings', 'api_secret');
      await queryInterface.removeColumn('school_meeting_settings', 'school_vls_id');
      await queryInterface.removeColumn('school_meeting_settings', 'branch_vls_id');
      await queryInterface.removeColumn('school_meeting_settings', 'status');


      await queryInterface.addColumn('vls_video_services', 'api_key', {
                type: Sequelize.STRING
      });
      await queryInterface.addColumn('vls_video_services', 'api_secret', {
                type: Sequelize.STRING
      });
      await queryInterface.addColumn('vls_video_services', 'school_vls_id', {
                type: Sequelize.INTEGER
      });
      await queryInterface.addColumn('vls_video_services', 'branch_vls_id', {
                type: Sequelize.INTEGER
      });
      await queryInterface.addColumn('vls_video_services', 'status', {
                type: Sequelize.INTEGER,
                defaultValue: 0
      });

  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
