'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('assignment', 'root_assignment_question_id');
    await queryInterface.removeColumn('assignment', 'no_of_assignments_submitted');
    await queryInterface.removeColumn('assignment', 'no_of_assignments_rejected');
    await queryInterface.addColumn('assignment', 'url', {
                    type: Sequelize.STRING,
                    allowNull: false
                });
    await queryInterface.addColumn('assignment', 'added_by', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                });
    await queryInterface.addColumn('assignment', 'user_role', {
                    type: Sequelize.STRING,
                    allowNull: false
                });
    await queryInterface.addColumn('assignment', 'total_marks', {
                    type: Sequelize.STRING,
                    allowNull: false
                });
    await queryInterface.changeColumn('assignment', 'student_vls_id', {
                      type: Sequelize.TEXT
                  });
    await queryInterface.renameColumn('assignment', 'student_vls_id', 'student_vls_ids');
    await queryInterface.changeColumn('assignment', 'assignment_level', {
                      type: Sequelize.ENUM('basic','intermediate','expert')
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
