'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('assignment', 'is_released', {
                    type: Sequelize.TINYINT,
                    allowNull: false,
                    defaultValue: 0
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
