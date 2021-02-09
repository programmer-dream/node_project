'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('community_chat', 'user_list', {
                      type: Sequelize.TEXT('long'),
                      allowNull: false
                  });
    await queryInterface.changeColumn('community_chat', 'group_admin_user_id_list', {
                      type: Sequelize.TEXT('long'),
                      allowNull: false,
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
