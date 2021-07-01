'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.renameColumn('vls_meetings', 'metting_id', 'meeting_id')
      await queryInterface.renameColumn('vls_meetings', 'metting_date', 'meeting_date')
      await queryInterface.renameColumn('vls_meetings', 'metting_start', 'meeting_start')
      await queryInterface.renameColumn('vls_meetings', 'metting_end', 'meeting_end')
      await queryInterface.changeColumn('vls_meetings', 'class_id', {
                type: Sequelize.STRING
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
