'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('community_chat', 'group_description', {
                type: Sequelize.TEXT
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
