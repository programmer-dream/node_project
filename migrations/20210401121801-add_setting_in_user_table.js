'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_settings', 'passion_support', {
                type: Sequelize.ENUM('yes', 'no'),
                defaultValue: 'no'
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
