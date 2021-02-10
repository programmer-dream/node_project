'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('exam_results');
    await queryInterface.createTable('exam_results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      academic_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_subject: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_mark: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_obtain_mark: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      avg_grade_point: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      grade_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      result_status: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      merit_rank_in_class: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      merit_rank_in_section: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      remark: {
        type: Sequelize.STRING(100)
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      modified_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('exam_results');
  }
};
