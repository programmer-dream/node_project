'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('vls_meeting_services');
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
