'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'is_deleted', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            });
    await queryInterface.addColumn('employees', 'is_deleted', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
