'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('users', 'rewards_points', {
            type: Sequelize.FLOAT,
            allowNull: false
        });
      await queryInterface.addColumn('users', 'rewards_request', {
                type: Sequelize.FLOAT,
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
