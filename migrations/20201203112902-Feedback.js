'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('feedback', {
      reply_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      feedback_type: {
        type: Sequelize.ENUM('Query','LearningLibrary','VideoLibrary','Ticket')
      },
      query_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      learning_library_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      video_library_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      live_meeting_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ticket_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      reply_user_type: {
        allowNull: false,
        type: Sequelize.ENUM('student','Faculty','Parent')
      },
      reply_message: {
        allowNull: false,
        type: Sequelize.STRING
      },
      student_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      teacher_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      parent_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      reply_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      reply_reply_vls_id: {
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
     await queryInterface.dropTable('feedback');
  }
};
