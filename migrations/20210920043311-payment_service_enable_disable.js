'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('school', 'payment_service', {
                type: Sequelize.ENUM('no','yes'),
                allowNull: false
            });
    await queryInterface.addColumn('branch_details', 'payment_service', {
                type: Sequelize.ENUM('no','yes'),
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
