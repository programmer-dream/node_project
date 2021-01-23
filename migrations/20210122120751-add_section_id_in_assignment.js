'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('assignment', 'section_id', {
                    type: Sequelize.INTEGER
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
