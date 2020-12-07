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
      CommunityChatCommunicationVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      CommunityChatVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ReplyUserType: {
        type: Sequelize.STRING
      },
      ReplyMessage: {
        type: Sequelize.TEXT
      },
      SenderType: {
        type: Sequelize.STRING
      },
      SenderVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ReplyDate: {
        type: Sequelize.DATE
      },
      NextCommunityChatCommunicationVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ReplyCommunityChatCommunicationVlsId: {
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
