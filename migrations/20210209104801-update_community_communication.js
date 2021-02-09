'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('community_chat_communicaiton', 'reply_community_chat_communication_vls_id');
    await queryInterface.removeColumn('community_chat_communicaiton', 'reply_user_type');
    await queryInterface.renameColumn('community_chat_communicaiton', 'reply_message', 'comment');
    await queryInterface.addColumn('community_chat_communicaiton', 'file_url', {
                type: Sequelize.STRING
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
