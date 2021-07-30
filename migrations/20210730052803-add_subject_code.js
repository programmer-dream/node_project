'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vls_meetings', 'subject_id', 'subject_code');
    await queryInterface.changeColumn('vls_meetings', 'subject_code', {
                type: Sequelize.STRING
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
