'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('StudentQuery', {
      BranchTimesheetId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      QueryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      StudentVlsId: {
        type: Sequelize.INTEGER
      },
      ClassVlsId: {
        type: Sequelize.INTEGER
      },
      QueryType: {
        type: Sequelize.STRING
      },
      QueryDate: {
        type: Sequelize.STRING
      },
      QueryStatus: {
        type: Sequelize.ENUM('open','Inprogress','Closed','Rejected')
      },
      Topic: {
        type: Sequelize.STRING
      },
      Subject: {
        type: Sequelize.STRING
      },
      QueryLevel: {
        type: Sequelize.ENUM('Basic', 'Intermediate','Expert')
      },
      Headline: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
      },
      Response: {
        type: Sequelize.STRING
      },
      ResponseDate: {
        type: Sequelize.STRING
      },
      ReplyVlsId: {
        type: Sequelize.INTEGER
      },
      Rating: {
        type: Sequelize.STRING
      },
      Likes: {
        type: Sequelize.STRING
      },
      Tags: {
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
     await queryInterface.dropTable('StudentQuery');
  }
};
