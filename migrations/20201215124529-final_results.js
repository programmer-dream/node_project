'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('final_results', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        Branch_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        school_id: {
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
        academic_year_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        student_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        total_subject: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        total_mark: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        total_obtain_mark: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        avg_grade_point: {
          allowNull: false,
          type: Sequelize.FLOAT
        },
        grade_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        result_status: {
          allowNull: false,
          type: Sequelize.STRING(50)
        },
        merit_rank_in_class: {
          allowNull: false,
          type: Sequelize.STRING(20)
        },
        merit_rank_in_section: {
          allowNull: false,
          type: Sequelize.STRING(20)
        },
        remark: {
          type: Sequelize.STRING(100)
        },
        status: {
          allowNull: false,
          type: Sequelize.BOOLEAN
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
     await queryInterface.dropTable('final_results');
  }
};
