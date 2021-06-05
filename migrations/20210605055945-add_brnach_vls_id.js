'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('student_learning_library', 'branch_vls_id', {
                type: Sequelize.INTEGER,
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
