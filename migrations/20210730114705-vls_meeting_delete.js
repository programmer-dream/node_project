'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vls_meetings', 'is_deleted', {
                type: Sequelize.TINYINT(1),
                defaultValue:0
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
