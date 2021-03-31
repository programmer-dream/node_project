'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('tickets', 'branch_vls_id', {
            type: Sequelize.INTEGER
        });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
