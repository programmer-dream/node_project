'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('school', 'passion_support', {
                type: Sequelize.ENUM('yes', 'no'),
                defaultValue: 'no'
            });
      await queryInterface.addColumn('branch_details', 'passion_support', {
                type: Sequelize.ENUM('yes', 'no'),
                defaultValue: 'no'
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
