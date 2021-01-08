'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
          await queryInterface.renameColumn('routines', 'branch_timesheet_id', 'timesheet_id'),
           await queryInterface.changeColumn('routines', 'timesheet_id', {
                      type: Sequelize.INTEGER,
                      allowNull: false,
                      autoIncrement: true
                  })
     ])
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
