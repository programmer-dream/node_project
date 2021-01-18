'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('exams', 'school_id', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                });
    await queryInterface.addColumn('exams', 'academic_year_id', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                });
    await queryInterface.addColumn('exams', 'title', {
                    type: Sequelize.STRING(100),
                    allowNull: false
                });
    await queryInterface.addColumn('exams', 'note', {
                    type: Sequelize.TEXT
                });
    await queryInterface.addColumn('exams', 'status', {
                    type: Sequelize.TINYINT(1),
                    allowNull: false
                });
    await queryInterface.addColumn('exams', 'created_by', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                });
    await queryInterface.addColumn('exams', 'modified_by', {
                    type: Sequelize.INTEGER,
                    allowNull: false
                });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
