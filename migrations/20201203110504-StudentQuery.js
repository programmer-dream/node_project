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
      branchTimesheetId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      queryVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      studentVlsId: {
        type: Sequelize.INTEGER
      },
      classVlsId: {
        type: Sequelize.INTEGER
      },
      queryType: {
        type: Sequelize.STRING
      },
      queryDate: {
        type: Sequelize.STRING
      },
      queryStatus: {
        type: Sequelize.ENUM('open','Inprogress','Closed','Rejected')
      },
      topic: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      queryLevel: {
        type: Sequelize.ENUM('Basic', 'Intermediate','Expert')
      },
      headline: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      response: {
        type: Sequelize.STRING
      },
      responseDate: {
        type: Sequelize.STRING
      },
      replyVlsId: {
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.STRING
      },
      tags: {
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
