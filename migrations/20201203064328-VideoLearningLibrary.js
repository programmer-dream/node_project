
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('VideoLearningLibrary', {
      videoLearningLibraryVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      topic: {
        type: Sequelize.STRING
      },
      URL: {
        type: Sequelize.STRING
      },
      videoFormat: {
        type: Sequelize.STRING
      },
      videoSize: {
        type: Sequelize.STRING
      },
      recommendedStudentLevel: {
        type: Sequelize.STRING
      },
      videoLibraryLevel: {
        type: Sequelize.ENUM('Basic', 'Intermediate','Expert')
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
        type: Sequelize.STRING
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
     await queryInterface.dropTable('VideoLearningLibrary');
  }
};
