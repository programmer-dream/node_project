'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notification');
    await queryInterface.createTable('notification', {
      notification_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      event_type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('general','important','critical'),
        allowNull: false,
      },
      notificaton_type: {
        type: Sequelize.ENUM('assignment','meeting','query','community','exam'),
        allowNull: false
      },
      notificaton_type_id : {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      users:{
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      added_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      added_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      close_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('notification');
  }
};
