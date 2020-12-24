'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return Promise.all([
           queryInterface.changeColumn('student_query', 'response', {
                      type: Sequelize.TEXT,
                      allowNull: true
                  }),
           
     ])
  },

  down: async (queryInterface, Sequelize) => {

  }
};
