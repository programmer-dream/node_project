'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return Promise.all([
         await queryInterface.addColumn('subjects', 'school_id', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }),
         await queryInterface.addColumn('subjects', 'type', {
                    type: Sequelize.STRING(50),
                    allowNull: false
                }),
         await queryInterface.addColumn('subjects', 'code', {
                    type: Sequelize.STRING(50),
                    allowNull: false
                }),
         await queryInterface.addColumn('subjects', 'author', {
                    type: Sequelize.STRING(100),
                }),
         await queryInterface.addColumn('subjects', 'status', {
                    type: Sequelize.INTEGER,
                }),
         await queryInterface.addColumn('subjects', 'note', {
                    type: Sequelize.TEXT,
                }),
         await queryInterface.addColumn('subjects', 'created_by', {
                    type: Sequelize.INTEGER,
                }),
         await queryInterface.addColumn('subjects', 'modified_by', {
                    type: Sequelize.TINYINT(1),
                })
                
     ])
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
