'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('mailbox', {
      mailbox_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message_vls_id: {
        allowNull: false,
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
      sender_user_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      receiver_user_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      from_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      receive_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      subject: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT
      },
      spare1: {
        type: Sequelize.STRING
      },
      spare2: {
        type: Sequelize.STRING
      },
      spare3: {
        type: Sequelize.STRING
      },
      spare4: {
        type: Sequelize.STRING
      },
      spare5: {
        type: Sequelize.STRING
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
     await queryInterface.dropTable('mailbox');
  }
};
