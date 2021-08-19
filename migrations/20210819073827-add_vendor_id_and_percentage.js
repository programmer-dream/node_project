'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('branch_details', 'vendor_id', {
                type: Sequelize.STRING,
            });
    await queryInterface.addColumn('branch_details', 'vendor_percentage', {
                type: Sequelize.STRING,
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
