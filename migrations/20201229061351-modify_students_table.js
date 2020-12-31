'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
         queryInterface.addColumn('students', 'class_id', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }),
         queryInterface.addColumn('students', 'section_id', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }),
         queryInterface.addColumn('students', 'school_id', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                })
                
     ])
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
