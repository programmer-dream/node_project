'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoices', {
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
      custom_invoice_id: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      is_applicable_discount: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue:0
      },
      academic_year_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      invoice_type: {
        allowNull: false,
        type: Sequelize.ENUM('invoice','income'),
      },
      class_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      student_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      month: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      gross_amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      net_amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      discount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      paid_status: {
        allowNull: false,
        type: Sequelize.ENUM('unpaid','paid'),
      },
      temp_amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('invoices');
  }
};
