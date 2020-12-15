'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('vls_app_setting', {
          vls_app_setting_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          learning_library_setting: {
            type: Sequelize.TEXT
          },
          assignment_storage_setting: {
            type: Sequelize.TEXT
          },
          assignment_submission_setting: {
            type: Sequelize.TEXT
          },
          chat_setting: {
            type: Sequelize.TEXT
          },
          video_library_storage_setting: {
            type: Sequelize.TEXT
          },
          video_library_setting: {
            type: Sequelize.STRING
          },
          Reward_setting: {
            type: Sequelize.TEXT
          },
          community_chat_setting: {
            type: Sequelize.STRING
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE
          }
        },
        {
          engine: 'InnoDB',
          charset: 'utf8mb4',
        }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('vls_app_setting');
  }
};
