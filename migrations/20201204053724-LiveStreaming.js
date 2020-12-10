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
      liveStreamVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createDate: {
        type: Sequelize.DATE
      },
      subject: {
        type: Sequelize.STRING
      },
      meetingDateTime: {
        type: Sequelize.DATE
      },
      meetingLink: {
        type: Sequelize.STRING
      },
      meetingType: {
        type: Sequelize.ENUM('Internal','Public')
      },
      rating: {
        type: Sequelize.STRING
      },
      meetingOwnerVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      meetingCreaterVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      noOfInvitees: {
        type: Sequelize.STRING
      },
    noOfAttendees: {
        type: Sequelize.STRING
      },
      inviteesVlsIdsList: {
        type: Sequelize.STRING
      },
      liveStreamTokenId: {
        type: Sequelize.INTEGER
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
      replyVlsId: {
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
