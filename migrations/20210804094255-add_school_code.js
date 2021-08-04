'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'school_code', {
                type: Sequelize.STRING,
                allowNull: false
            });
    await queryInterface.addColumn('school', 'school_code', {
                type: Sequelize.STRING,
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
