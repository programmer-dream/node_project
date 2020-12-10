'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('CommunityChatCommunicaiton', {
      communityChatCommunicationVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      communityChatVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      replyUserType: {
        type: Sequelize.STRING
      },
      replyMessage: {
        type: Sequelize.TEXT
      },
      senderType: {
        type: Sequelize.STRING
      },
      senderVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      replyDate: {
        type: Sequelize.DATE
      },
      nextCommunityChatCommunicationVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      replyCommunityChatCommunicationVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
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
     await queryInterface.dropTable('CommunityChatCommunicaiton');
  }
};
