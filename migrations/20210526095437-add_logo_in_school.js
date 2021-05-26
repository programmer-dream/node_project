'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('school', 'logo', {
                type: Sequelize.STRING,
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
