'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rating_like_learning_library', 'user_type', {
                type: Sequelize.STRING,
                allowNull: false
            });
    await queryInterface.addColumn('rating_like_videos_learning_library', 'user_type', {
                type: Sequelize.STRING,
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
