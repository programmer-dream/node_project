'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('assignment', 'url', {
                      type: Sequelize.STRING
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
