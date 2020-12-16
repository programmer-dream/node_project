'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('marks', {
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
        exam_id: {
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
        academic_year_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        student_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        grade_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        written_mark: {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        written_obtain  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        tutorial_mark  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        tutorial_obtain  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        practical_mark  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        practical_obtain  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        viva_mark  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        viva_obtain  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        exam_total_mark  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
        },
        obtain_total_mark  : {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.INTEGER
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
     await queryInterface.dropTable('marks');
  }
};
