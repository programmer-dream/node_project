'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('assignment_questions', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('community_rating_like', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('employees', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('exams', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('guardians', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('notification_read_by', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('rating_like_learning_library', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('rating_like_query', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('student_assignment_response', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('student_learning_library', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('student_vls', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('Student_vls_report', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('ticket_rating', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
      await queryInterface.addColumn('user_settings', 'school_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
