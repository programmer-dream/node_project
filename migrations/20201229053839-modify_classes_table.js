'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
           queryInterface.addColumn('classes', 'school_id', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  }),
           queryInterface.addColumn('classes', 'numeric_name', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  }),
           queryInterface.addColumn('classes', 'note', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
           queryInterface.addColumn('classes', 'created_by', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  }),
           queryInterface.addColumn('classes', 'modified_by', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  }),
           queryInterface.addColumn('classes', 'status', {
                      type: Sequelize.TINYINT(1),
                      allowNull: false
                  }),
           queryInterface.changeColumn('classes', 'name', {
                      type: Sequelize.STRING(100),
                      allowNull: false
                  })     
     ])
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
