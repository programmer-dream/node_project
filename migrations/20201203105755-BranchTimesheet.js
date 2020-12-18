'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('routines', {
      branch_timesheet_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      class_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      section_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      subject_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      teacher_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      academic_year_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      day: {
        allowNull: false,
        type: Sequelize.STRING
      },
      start_time: {
        allowNull: false,
        type: Sequelize.STRING
      },
      end_time: {
        allowNull: false,
        type: Sequelize.STRING
      },
      room_no: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1)
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('routines');
  }
};
