'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rating_like_query', 'user_role', {
                type: Sequelize.STRING,
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
