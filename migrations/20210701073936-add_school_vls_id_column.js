'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('school_meeting_settings', 'school_vls_id', {
                type: Sequelize.STRING,
                allowNull: false
      });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
