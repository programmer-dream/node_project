
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
      VideoLearningLibraryVlsId: {
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
      Subject: {
        type: Sequelize.STRING
      },
      Topic: {
        type: Sequelize.STRING
      },
      URL: {
        type: Sequelize.STRING
      },
      VideoFormat: {
        type: Sequelize.STRING
      },
      VideoSize: {
        type: Sequelize.STRING
      },
      RecommendedStudentLevel: {
        type: Sequelize.STRING
      },
      VideoLibraryLevel: {
        type: Sequelize.ENUM('Basic', 'Intermediate','Expert')
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
