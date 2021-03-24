'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'rewards_points', {
            type: Sequelize.FLOAT,
            defaultValue:0
        });
    await queryInterface.changeColumn('users', 'rewards_request', {
                type: Sequelize.FLOAT,
                defaultValue:0
            });
    await queryInterface.changeColumn('users', 'point_redeemed', {
                type: Sequelize.FLOAT,
                defaultValue:0
            });
      await queryInterface.changeColumn('tickets', 'redeem_point', {
                type: Sequelize.FLOAT,
                defaultValue:0
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
