'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sections', 'section_vls_id');
    await queryInterface.renameColumn('sections', 'Branch_vls_id', 'branch_vls_id')

  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
