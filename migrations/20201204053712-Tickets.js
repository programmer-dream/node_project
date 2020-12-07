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
      TicketVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TicketOwner: {
        type: Sequelize.ENUM('Student','faculty','parent')
      },
      TickerOwnerVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Subject: {
        type: Sequelize.STRING
      },
      OpenDate: {
        type: Sequelize.DATE
      },
      Response: {
        type: Sequelize.STRING
      },
      Attachment: {
        type: Sequelize.STRING
      },
      TicketStatus: {
        type: Sequelize.STRING
      },
      ReplyVlsId: {
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
