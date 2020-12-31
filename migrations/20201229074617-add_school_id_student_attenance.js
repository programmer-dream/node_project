'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
           queryInterface.addColumn('student_attendances', 'school_id', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  })
                
     ])
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
