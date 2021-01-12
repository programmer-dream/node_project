'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('exam_attendences', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('exam_schedules', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('learning_library', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('live_streaming', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('mailbox', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('marks', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('recognition', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('rewards', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('routines', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('student_learning_library', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('student_query', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('Student_vls_report', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('tickets', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
    await queryInterface.addColumn('video_learning_library', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
