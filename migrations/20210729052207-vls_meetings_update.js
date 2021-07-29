'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vls_meetings', 'meeting_type', {
                allowNull: false,
                type: Sequelize.ENUM('online_meeting', 'live_classes'),
                defaultValue: 'live_classes'
            });
    await queryInterface.addColumn('meetings', 'vls_meeting_id', {
                type: Sequelize.INTEGER
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
