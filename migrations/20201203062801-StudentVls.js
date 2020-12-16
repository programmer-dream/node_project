'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

  await queryInterface.createTable('student_vls', {
      student_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rewards_earned: {
        type: Sequelize.STRING
      },
      rewards_redeemed: {
        type: Sequelize.STRING
      },
      no_of_queries_raised: {
        type: Sequelize.STRING
      },
      time_spent: {
        type: Sequelize.STRING
      },
      badge_earn: {
        type: Sequelize.STRING
      },
      no_of_recognitions: {
        type: Sequelize.STRING
      },
      average_recognition_rating: {
        type: Sequelize.STRING
      },
      time_spent_video_learning_library: {
        allowNull: false,
        type: Sequelize.STRING
      },
      student_lenaring_library_vls_id: {
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
     await queryInterface.dropTable('student_vls');
  }
};
