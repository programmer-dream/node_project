'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('expenditures', {
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
      academic_year_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      expenditure_head_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      expenditure_type: {
        type: Sequelize.STRING(20)
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      expenditure_via: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      reference: {
        type: Sequelize.STRING(100)
      },
      date: {
        type: Sequelize.DATE
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
      await queryInterface.dropTable('expenditures');
  }
};
