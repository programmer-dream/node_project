'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('student_query', 'subject');
    await queryInterface.addColumn('student_query', 'subject_id', {
                type: Sequelize.INTEGER,
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
