'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('student_query', 'subject_id', {
                      type: Sequelize.INTEGER
                  });
      await queryInterface.changeColumn('exam_schedules', 'subject_id', {
                      type: Sequelize.INTEGER
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
