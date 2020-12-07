'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('Notification', {
      NotificationVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Message: {
        type: Sequelize.TEXT
      },
      Sender: {
        type: Sequelize.STRING
      },
      ReceiverType: {
        type: Sequelize.ENUM('general','faculty','student','parents','school')
      },
      updateDate: {
        type: Sequelize.DATE
      },
      StartDate: {
        type: Sequelize.DATE
      },
      EndDate: {
        type: Sequelize.DATE
      },
      NotificationType: {
        type: Sequelize.ENUM('Display','pop-up','alert')
      },
      NoOfRepetition: {
        type: Sequelize.STRING
      },
      NoOfRepeatPerDay: {
        type: Sequelize.STRING
      },
      URL: {
        type: Sequelize.STRING
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
     await queryInterface.dropTable('Notification');
  }
};
