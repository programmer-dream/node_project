'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('meetings', 'rejected_by', {
                    type: Sequelize.INTEGER
                });
    await queryInterface.addColumn('meetings', 'rejected_role', {
                    type: Sequelize.STRING
                });
    await queryInterface.changeColumn('assignment', 'description', {
                    type: Sequelize.TEXT,
                    allowNull: false
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
