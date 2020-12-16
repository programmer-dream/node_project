'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('live_streaming', {
      live_stream_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      create_date: {
        type: Sequelize.DATE
      },
      subject: {
        type: Sequelize.STRING
      },
      meeting_date_time: {
        type: Sequelize.DATE
      },
      meeting_link: {
        type: Sequelize.STRING
      },
      meeting_type: {
        type: Sequelize.ENUM('Internal','Public')
      },
      rating: {
        type: Sequelize.STRING
      },
      meeting_owner_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      meeting_creater_vlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      no_of_invitees: {
        type: Sequelize.STRING
      },
      no_of_attendees: {
        type: Sequelize.STRING
      },
      invitees_vls_ids_list: {
        type: Sequelize.STRING
      },
      live_stream_token_id: {
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
      reply_vls_id: {
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
     await queryInterface.dropTable('live_streaming');
  }
};
