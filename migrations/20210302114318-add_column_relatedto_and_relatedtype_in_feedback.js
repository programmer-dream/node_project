'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('feedback', 'related_to', {
                type: Sequelize.STRING
            });
     await queryInterface.addColumn('feedback', 'related_type', {
                type: Sequelize.STRING
            });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('feedback', 'related_to')
     await queryInterface.removeColumn('feedback', 'related_type')
  }
};
