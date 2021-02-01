'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('student_attendances', 'subject_code', {
                    type: Sequelize.STRING
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
