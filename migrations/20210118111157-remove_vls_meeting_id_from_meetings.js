'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('meetings', 'vls_meeting_id');
    await queryInterface.addColumn('meetings', 'duration_type', {
                    type: Sequelize.ENUM('min','hour'),
                    allowNull: false
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
