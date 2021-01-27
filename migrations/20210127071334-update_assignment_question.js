'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('assignment_questions', 'branch_vls_id');
        await queryInterface.removeColumn('assignment_questions', 'school_vls_id');
        await queryInterface.removeColumn('assignment_questions', 'student_vls_id');
        await queryInterface.removeColumn('assignment_questions', 'next_assignment_question_id');
        await queryInterface.changeColumn('assignment_questions', 'question_type', {
                      type: Sequelize.ENUM('form','choice','multiple_checklist'),
                      allowNull: false
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
