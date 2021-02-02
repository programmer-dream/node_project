'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('student_attendances', 'subject_code', {
                    type: Sequelize.STRING(100)
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
