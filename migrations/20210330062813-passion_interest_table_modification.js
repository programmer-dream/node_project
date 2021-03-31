'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('passion_and_interests', 'community_chat_vls_id');
    await queryInterface.changeColumn('passion_and_interests', 'description', {
                type: Sequelize.TEXT('long'),
                allowNull: false
            });
     await queryInterface.changeColumn('passion_and_interests', 'passion_name', {
                type: Sequelize.STRING,
                allowNull: false
            });

     await queryInterface.addColumn('passion_and_interests', 'is_comment', {
                type: Sequelize.TINYINT(1),
                defaultValue:0
            });
     await queryInterface.addColumn('passion_and_interests', 'status', {
                type: Sequelize.TINYINT(1),
                defaultValue:0
            });
     await queryInterface.addColumn('passion_and_interests', 'added_by', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
     await queryInterface.addColumn('passion_and_interests', 'user_type', {
                type: Sequelize.STRING(100),
                allowNull: false
            });

  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
