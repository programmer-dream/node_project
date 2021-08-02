'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vls_meetings', 'resource_meeting_id', {
                type: Sequelize.STRING
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
