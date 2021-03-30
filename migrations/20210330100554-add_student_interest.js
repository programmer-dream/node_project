'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('students', 'interest', {
                type: Sequelize.TEXT('long'),
                allowNull: false
            });
    await queryInterface.changeColumn('notification', 'notificaton_type', {
            type: Sequelize.ENUM('assignment','meeting','query','community','exam','feedback','rewards_and_recongnition','custom_notification','blog'),
                allowNull: false
        });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
