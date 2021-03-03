'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('community_chat_communicaiton', 'file_type', {
                type: Sequelize.STRING
            });
     await queryInterface.addColumn('community_chat_communicaiton', 'image_thumbnail', {
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
     await queryInterface.removeColumn('community_chat_communicaiton', 'file_type')
     await queryInterface.removeColumn('community_chat_communicaiton', 'image_thumbnail')
  }
};
