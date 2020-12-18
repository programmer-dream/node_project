'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('tickets', {
      ticket_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ticket_owner: {
        type: Sequelize.ENUM('Student','faculty','parent')
      },
      ticker_owner_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.STRING
      },
      open_date: {
        type: Sequelize.DATE
      },
      response: {
        type: Sequelize.STRING
      },
      attachment: {
        type: Sequelize.STRING
      },
      ticket_status: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('tickets');
  }
};
