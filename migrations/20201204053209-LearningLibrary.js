'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('LearningLibrary', {
      LearningLibraryVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
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
      DocumentType: {
        type: Sequelize.STRING
      },
      DocumentSize: {
        type: Sequelize.STRING
      },
      RecommendedStudentLevel: {
        type: Sequelize.ENUM('Basic','Intermediate','Expert')
      },
      LibraryLevel: {
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
      ReplyVlsId: {
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
     await queryInterface.dropTable('LearningLibrary');
  }
};
