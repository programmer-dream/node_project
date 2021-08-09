'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('meetings', 'meeting_location', {
                type: Sequelize.STRING
            });
    await queryInterface.changeColumn('meetings', 'attendee_type', {
                type: Sequelize.ENUM('parent', 'teacher','all_teacher'),
                allowNull: false
            });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
