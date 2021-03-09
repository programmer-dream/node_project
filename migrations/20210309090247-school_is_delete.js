'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('school', 'is_deleted', {
                type: Sequelize.BOOLEAN,
                defaultValue: 0
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
