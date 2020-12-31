'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('academic_years', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      session_year: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      start_year: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      end_year: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.TEXT
      },
      is_running: {
        allowNull: false,
        type: Sequelize.TINYINT(1)
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      modified_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      modified_by: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('academic_years');
  }
};
