'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('assignment', 'subject_code', {
                    type: Sequelize.STRING,
                    allowNull: false
                });
    await queryInterface.addColumn('assignment', 'title', {
                    type: Sequelize.STRING,
                    allowNull: false
                });
    await queryInterface.addColumn('assignment', 'description', {
                    type: Sequelize.STRING,
                    allowNull: false
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
