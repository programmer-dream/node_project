'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tickets', 'is_comment', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
