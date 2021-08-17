'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('notification', 'notificaton_type', {
                type: Sequelize.ENUM('assignment','meeting','query','community','exam','feedback','rewards_and_recongnition','custom_notification','blog','live_class'),
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
