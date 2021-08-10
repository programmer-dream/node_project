'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoice_detail', {
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
      invoice_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      income_head_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      invoice_type: {
        allowNull: false,
        type: Sequelize.ENUM('income', 'fee', 'hostel', 'transport')
      },
      gross_amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      discount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      net_amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('invoice_detail');
  }
};
