'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('student_query', 'is_comment', {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            })
  },
  down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('student_query', 'is_comment')
  }
};
