'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vls_meetings', 'meeting_id', {
                allowNull: false,
                autoIncrement: true,
                type: Sequelize.INTEGER
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
