'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('LiveStreaming', {
      LiveStreamVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      CreateDate: {
        type: Sequelize.DATE
      },
      Subject: {
        type: Sequelize.STRING
      },
      MeetingDateTime: {
        type: Sequelize.DATE
      },
      MeetingLink: {
        type: Sequelize.STRING
      },
      MeetingType: {
        type: Sequelize.ENUM('Internal','Public')
      },
      Rating: {
        type: Sequelize.STRING
      },
      MeetingOwnerVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      MeetingCreaterVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      NoOfInvitees: {
        type: Sequelize.STRING
      },
      NoOfAttendees: {
        type: Sequelize.STRING
      },
      InviteesVlsIdsList: {
        type: Sequelize.STRING
      },
      LiveStreamTokenId: {
        type: Sequelize.INTEGER
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
      ReplyVlsId: {
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
     await queryInterface.dropTable('LiveStreaming');
  }
};
