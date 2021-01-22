'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('student_assignment', 'url', {
                    type: Sequelize.STRING
                });
    await queryInterface.removeColumn('student_assignment', 'followup_assignment_vls_id');
    await queryInterface.changeColumn('student_assignment', 'comments', {
                      type: Sequelize.TEXT
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
