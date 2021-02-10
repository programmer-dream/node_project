'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('community_chat_communicaiton', 'comment', 'comment_body');
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
