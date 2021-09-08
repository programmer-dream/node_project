'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('meetings', 'attendee_vls_id', {
                type: Sequelize.TEXT('long'),
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
