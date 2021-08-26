'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transactions', 'transaction_failed_reason', {
                type: Sequelize.TEXT
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
