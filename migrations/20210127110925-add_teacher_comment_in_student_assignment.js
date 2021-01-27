'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('student_assignment', 'teacher_comment', {
                    type: Sequelize.TEXT
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
