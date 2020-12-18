'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('community_chat_communicaiton', {
      community_chat_communication_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      community_chat_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      reply_user_type: {
        type: Sequelize.STRING
      },
      reply_message: {
        type: Sequelize.TEXT
      },
      sender_type: {
        type: Sequelize.STRING
      },
      sender_user_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      reply_date: {
        type: Sequelize.DATE
      },
      reply_community_chat_communication_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
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
     await queryInterface.dropTable('community_chat_communicaiton');
  }
};
