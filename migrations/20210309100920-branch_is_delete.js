'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('branch_details', 'is_deleted', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
