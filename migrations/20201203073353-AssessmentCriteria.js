'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('assessment_criteria', {
      assessment_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      first_subject_test_max: {
        type: Sequelize.STRING
      },
      first_subject_test_passing_criteria: {
        type: Sequelize.STRING
      },
      first_subject_test_first_class_criteria: {
        type: Sequelize.STRING
      },
      first_subject_test_second_class_criteria: {
        type: Sequelize.STRING
      },
      first_subject_test_third_class_criteria: {
        type: Sequelize.STRING
      },
      other_subject_test_max: {
        type: Sequelize.STRING
      },
      other_subject_test_passing_criteria: {
        type: Sequelize.STRING
      },
      other_subject_test_first_class_criteria: {
        type: Sequelize.STRING
      },
      other_subject_test_second_class_criteria: {
        type: Sequelize.STRING
      },
      other_subject_test_third_class_criteria: {
        type: Sequelize.STRING
      },
      first_subject_annual_max: {
        type: Sequelize.STRING
      },
      first_subject_annual_passing_criteria: {
        type: Sequelize.STRING
      },
      first_subject_annual_first_class_criteria: {
        type: Sequelize.STRING
      },
      first_subject_annual_second_class_criteria: {
        type: Sequelize.STRING
      },
      first_subject_annual_third_class_criteria: {
        type: Sequelize.STRING
      },
      other_subject_annual_max: {
        type: Sequelize.STRING
      },
      other_subject_annual_passing_criteria: {
        type: Sequelize.STRING
      },
      other_subject_annual_first_class_criteria: {
        type: Sequelize.STRING
      },
      other_subject_annual_second_class_criteria: {
        type: Sequelize.STRING
      },
      other_subject_annual_third_class_criteria: {
        type: Sequelize.STRING
      },
      sport_passing_criteria: {
        type: Sequelize.STRING
      },
      sports_first_class_criteria: {
        type: Sequelize.STRING
      },
      sport_second_class_criteria: {
        type: Sequelize.STRING
      },
      sport_third_class_criteria: {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('assessment_criteria');
  }
};
