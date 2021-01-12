'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('meetings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      vls_meeting_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      meeting_author_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      originator_type: {
        type: Sequelize.ENUM('principal'),
        allowNull: false
      },
      attendee_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      attendee_type: {
        type: Sequelize.ENUM('parent','teacher'),
        allowNull: false
      },
      attendee_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      attendee_remarks: {
        type: Sequelize.STRING,
        allowNull: false
      },
      meeting_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meeting_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      meeting_mode: {
        type: Sequelize.ENUM('online','f2f','voice_call'),
        allowNull: false
      },
      meeting_location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false
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
      await queryInterface.dropTable('meetings');
  }
};
