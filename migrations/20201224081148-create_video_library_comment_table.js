'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('video_learning_library_comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      video_learning_library_vls_id : {
        type: Sequelize.INTEGER
      },
      user_vls_id: {
        type: Sequelize.INTEGER
      },
      user_type: {
        type: Sequelize.STRING
      },
      reply_vls_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.TINYINT(1)
      },
      comment_body: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('video_learning_library_comments');
  }
};
