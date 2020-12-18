'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('community_chat', {
      community_chat_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      group_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      group_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      user_list: {
        allowNull: false,
        type: Sequelize.STRING
      },
      group_admin_user_id_list: {
        type: Sequelize.STRING
      },
      ratings: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.STRING
      },
      community_chat_communication_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      community_status: {
        type: Sequelize.ENUM('Active','Deleted')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('community_chat');
  }
};
