'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('Mailbox', {
      mailboxId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      messageVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      senderUserVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      receiverUserVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fromDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      receiveDate: {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
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
     await queryInterface.dropTable('Mailbox');
  }
};
