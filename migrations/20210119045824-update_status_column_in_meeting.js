'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('meetings', 'attendee_status', {
                      type: Sequelize.ENUM('open','accept','reject'),
                      	allowNull: false,
            			defaultValue: 'open'
                  });
    await queryInterface.changeColumn('meetings', 'originator_type', {
                      type: Sequelize.ENUM('principal','branch_admin'),
                        allowNull: false,
                  });
    await queryInterface.changeColumn('meetings', 'attendee_remarks', {
                      type: Sequelize.STRING
                  });
    await queryInterface.changeColumn('meetings', 'attendee_vls_id', {
                      type: Sequelize.BIGINT,
                      allowNull: false,
                  });
    await queryInterface.removeConstraint('meetings', 'attendee_vls_id')
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
