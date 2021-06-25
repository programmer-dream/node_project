'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('school', 'video_service_enabled', {
                type: Sequelize.ENUM('yes', 'no'),
                defaultValue: 'no'
            });
      await queryInterface.addColumn('school', 'is_vls_online_video_service_enabled', {
                type: Sequelize.ENUM('yes', 'no'),
                defaultValue: 'no'
            });
      await queryInterface.addColumn('school', 'max_simultaneous_online_meeting_supported', {
                type: Sequelize.INTEGER
            });
      await queryInterface.addColumn('school', 'video_services_enabled', {
                type: Sequelize.STRING
            });
      await queryInterface.addColumn('branch_details', 'is_video_meeting_enabled', {
              type: Sequelize.ENUM('yes', 'no'),
                defaultValue: 'no'
         });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
