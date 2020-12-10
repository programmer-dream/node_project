'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('Tickets', {
      ticketVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ticketOwner: {
        type: Sequelize.ENUM('Student','faculty','parent')
      },
      tickerOwnerVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.STRING
      },
      openDate: {
        type: Sequelize.DATE
      },
      response: {
        type: Sequelize.STRING
      },
      attachment: {
        type: Sequelize.STRING
      },
      ticketStatus: {
        type: Sequelize.STRING
      },
      replyVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
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
     await queryInterface.dropTable('Tickets');
  }
};
