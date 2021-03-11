'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('employees', 'father_name', {
            type: Sequelize.STRING
        });
    await queryInterface.changeColumn('employees', 'mother_name', {
            type: Sequelize.STRING
        });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
