'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('users', 'point_redeemed', {
                type: Sequelize.FLOAT,
                allowNull: false
            });
      await queryInterface.addColumn('tickets', 'redeem_point', {
                type: Sequelize.FLOAT,
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
