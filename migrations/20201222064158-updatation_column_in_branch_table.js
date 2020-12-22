'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
     queryInterface.changeColumn('branch_details', 'learning_library_support', {
                type: Sequelize.ENUM('yes','no')
            }),
     queryInterface.changeColumn('branch_details', 'feedback_support', {
                type: Sequelize.ENUM('yes','no')
            })
     ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
