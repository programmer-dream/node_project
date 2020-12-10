'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

  await queryInterface.createTable('StudentVls', {
      studentVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rewardsEarned: {
        type: Sequelize.STRING
      },
      rewardsRedeemed: {
        type: Sequelize.STRING
      },
      noOfQueriesRaised: {
        type: Sequelize.STRING
      },
      timeSpent: {
        type: Sequelize.STRING
      },
      badgeEarn: {
        type: Sequelize.STRING
      },
      noOfRecognitions: {
        type: Sequelize.STRING
      },
      averageRecognitionRating: {
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
     await queryInterface.dropTable('StudentVls');
  }
};
