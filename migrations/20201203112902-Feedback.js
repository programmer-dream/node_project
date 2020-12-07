'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('Feedback', {
      FeedbackId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ReplyVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      FeedbackType: {
        type: Sequelize.ENUM('Query','LearningLibrary','VideoLibrary','Ticket')
      },
      QueryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      LearningLibraryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      VideoLibraryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      LiveMeetingVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TicketVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ReplyUserType: {
        allowNull: false,
        type: Sequelize.ENUM('student','Faculty','Parent')
      },
      ReplyMessage: {
        allowNull: false,
        type: Sequelize.STRING
      },
      StudentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TeacherVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ParentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ReplyDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      NextReplyVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ReplyReplyVlsId: {
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
     await queryInterface.dropTable('Feedback');
  }
};
