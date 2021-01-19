'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('meetings', 'meeting_author_vls_id', {
                      type: Sequelize.BIGINT
                  });
    await queryInterface.changeColumn('meetings', 'attendee_vls_id', {
                      type: Sequelize.BIGINT
                  });
    await queryInterface.changeColumn('meetings', 'time', {
                      type: Sequelize.STRING(10)
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
