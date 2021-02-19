'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('notification', 'notificaton_type', {
                      type: Sequelize.ENUM('assignment','meeting','query','community','exam','feedback','rewards_and_recongnition','custom_notification'),
                      allowNull: false
                  });
    await queryInterface.addColumn('notification', 'class_id', {
                type: Sequelize.INTEGER
            });
    await queryInterface.addColumn('notification', 'section_id', {
                type: Sequelize.INTEGER
            });
    await queryInterface.changeColumn('notification', 'branch_vls_id', {
            type: Sequelize.INTEGER
        });
    await queryInterface.changeColumn('notification', 'school_vls_id', {
            type: Sequelize.INTEGER
        });
    await queryInterface.changeColumn('notification', 'users', {
            type: Sequelize.TEXT('long')
        });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
