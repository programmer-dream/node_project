'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transactions', 'bank_name', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('transactions', 'stripe_card_number', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('transactions', 'stack_email', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('transactions', 'bank_receipt', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('transactions', 'card_cvv', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('transactions', 'expire_month', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('transactions', 'expire_year', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('transactions', 'status', {
                type: Sequelize.TINYINT(1),
                defaultValue:0
            });
    await queryInterface.changeColumn('transactions', 'cheque_no', {
                type: Sequelize.STRING,
            });
    await queryInterface.changeColumn('transactions', 'stack_reference', {
                type: Sequelize.STRING,
            });

  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
