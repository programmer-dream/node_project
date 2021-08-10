'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('income_heads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branch_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      head_type: {
        allowNull: false,
        type: Sequelize.ENUM('fee', 'income', 'hostel', 'transport')
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.TEXT
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1)
      },
      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_by_role: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      modified_by: {
        type: Sequelize.INTEGER
      },
      modified_by_role: {
        type: Sequelize.STRING(50)
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
      await queryInterface.dropTable('income_heads');
  }
};
