'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('chat', {
      chat_vls_id: {
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
      student_vls_id: {
        type: Sequelize.INTEGER
      },
      sender_user_vls_id: {
        type: Sequelize.INTEGER
      },
      receiver_user_vls_id: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      chat_message: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      next_chat_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      attachment: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      attachmentType: {
        allowNull: false,
        type: Sequelize.ENUM('image','document')
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
     await queryInterface.dropTable('chat');
  }
};
