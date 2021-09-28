'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invoices', 'payment_prefix', {
                type: Sequelize.STRING,
                defaultValue: "order_"
            });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('invoices', 'payment_prefix')
  }
};
