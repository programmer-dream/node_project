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
      StudentVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RewardsEarned: {
        type: Sequelize.STRING
      },
      RewardsRedeemed: {
        type: Sequelize.STRING
      },
      NoOfQueriesRaised: {
        type: Sequelize.STRING
      },
      TimeSpent: {
        type: Sequelize.STRING
      },
      badgeEarn: {
        type: Sequelize.STRING
      },
      NoOfRecognitions: {
        type: Sequelize.STRING
      },
      AverageRecognitionRating: {
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
