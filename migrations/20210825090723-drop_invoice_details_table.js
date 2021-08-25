'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.dropTable('invoice_details');
     
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
