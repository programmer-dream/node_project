'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('branch_details', 'vendor_details', {
                type: Sequelize.TEXT
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
