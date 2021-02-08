'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('chat', 'student_vls_id');
    await queryInterface.removeColumn('chat', 'next_chat_vls_id');
    await queryInterface.changeColumn('chat', 'attachment', {
                      type: Sequelize.STRING
                  });
    await queryInterface.changeColumn('chat', 'attachmentType', {
                      type: Sequelize.ENUM('image','document')
                  });
    await queryInterface.addColumn('chat', 'sender_type', {
                    type: Sequelize.ENUM('employee','student','guardian'),
                    allowNull: false
                });
    await queryInterface.addColumn('chat', 'receiver_type', {
                    type: Sequelize.ENUM('employee','student','guardian'),
                    allowNull: false
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
