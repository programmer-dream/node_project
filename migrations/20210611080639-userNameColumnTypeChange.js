'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'user_name', {
                type: Sequelize.STRING,
                allowNull: false,
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
