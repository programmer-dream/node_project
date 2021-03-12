'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('tickets', 'ticket_owner')
    // await queryInterface.removeColumn('tickets', 'ticker_owner_vls_id')
    await queryInterface.addColumn('tickets', 'user_id', {
                type: Sequelize.INTEGER,
                allowNull: false
    });
    await queryInterface.addColumn('tickets', 'user_type', {
                type: Sequelize.STRING,
                allowNull: false,
    });
    await queryInterface.addColumn('tickets', 'ticket_priorty', {
                type: Sequelize.ENUM('minor','medium','critical'),
                allowNull: false
    });
    await queryInterface.addColumn('tickets', 'status', {
                type: Sequelize.ENUM('new','assigned','wip','resolved'),
                allowNull: false
    });
    await queryInterface.addColumn('tickets', 'ticket_type', {
                type: Sequelize.ENUM('application','infrastructure'),
                allowNull: false
    });
    await queryInterface.addColumn('tickets', 'assigned_user_id', {
                type: Sequelize.INTEGER,
                allowNull: false
    });
    await queryInterface.addColumn('tickets', 'assigned_user_type', {
                type: Sequelize.STRING,
                allowNull: false
    });
    await queryInterface.addColumn('tickets', 'description', {
                type: Sequelize.TEXT('long'),
                allowNull: false
    });
    await queryInterface.addColumn('tickets', 'resolved_date', {
                type: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
