'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('exam_schedules', 'exam_id');
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
