'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('assignment_questions', 'description');
    await queryInterface.addColumn('assignment_questions', 'assessment', {
                    type: Sequelize.STRING
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
