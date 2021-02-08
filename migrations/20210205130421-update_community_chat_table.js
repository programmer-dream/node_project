'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('community_chat', 'community_chat_communication_vls_id');
    await queryInterface.addColumn('community_chat', 'is_commented', {
                type: Sequelize.TINYINT,
                allowNull: false,
                defaultValue: 0
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
