'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('CommunityChat', {
      CommunityChatVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      GroupName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      GroupType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      UserList: {
        allowNull: false,
        type: Sequelize.STRING
      },
      GroupAdminUserIdList: {
        type: Sequelize.STRING
      },
      Ratings: {
        type: Sequelize.STRING
      },
      Tags: {
        type: Sequelize.STRING
      },
      Likes: {
        type: Sequelize.STRING
      },
      CommunityChatCommunicationVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      StartDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      CommunityStatus: {
        type: Sequelize.ENUM('Active','Deleted')
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
     await queryInterface.dropTable('CommunityChat');
  }
};
