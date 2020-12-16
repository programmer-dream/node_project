'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('invoices', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        Branch_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        school_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        custom_invoice_id: {
          allowNull: false,
          type: Sequelize.STRING(50)
        },
        is_applicable_discount: {
          type: Sequelize.BOOLEAN
          defaultValue: false,
        },
        academic_year_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        invoice_type: {
          allowNull: false,
          type: Sequelize.STRING(50)
        },
        class_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        student_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        month: {
          type: Sequelize.STRING(20)
        },
        gross_amount: {
          allowNull: false,
          type: Sequelize.DECIMAL(10,2)
        },
        net_amount: {
          allowNull: false,
          type: Sequelize.DECIMAL(10,2)
        },
        discount: {
          allowNull: false,
          type: Sequelize.DECIMAL(10,2)
        },
        paid_status: {
          allowNull: false,
          type: Sequelize.STRING(20)
          defaultValue: 'Unpaid',
        },
        temp_amount: {
          allowNull: false,
          type: Sequelize.DECIMAL(10,2)
        },
        date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        note: {
          type: Sequelize.TEXT
        },
        status: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        modified_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        created_by: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        modified_by: {
          allowNull: false,
          type: Sequelize.INTEGER
        }
      },
      {
          engine: 'InnoDB',
          charset: 'utf8mb4',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('invoices');
  }
};
