'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('passion_comments', {
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
      passion_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue : 0
      },
      comment_body: {
        type: Sequelize.TEXT,
        allowNull: false
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
      await queryInterface.dropTable('passion_comments');
  }
};
