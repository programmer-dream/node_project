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
      replyVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      feedbackType: {
        type: Sequelize.ENUM('Query','LearningLibrary','VideoLibrary','Ticket')
      },
      queryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      learningLibraryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      videoLibraryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      liveMeetingVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ticketVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      replyUserType: {
        allowNull: false,
        type: Sequelize.ENUM('student','Faculty','Parent')
      },
      replyMessage: {
        allowNull: false,
        type: Sequelize.STRING
      },
      studentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      teacherVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      parentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      replyDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      nextReplyVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      replyReplyVlsId: {
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
