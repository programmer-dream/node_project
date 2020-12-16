'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('transactions', {
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
        academic_year_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        invoice_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        amount: {
          allowNull: false,
          type: Sequelize.DECIMAL(10,2)
        },
        payment_method: {
          type: Sequelize.STRING(20)
        },
        bank_name: {
          type: Sequelize.STRING
        },
        cheque_no: {
          type: Sequelize.STRING(100)
        },
        transaction_id: {
          type: Sequelize.STRING(100)
        },
        payment_date: {
          type: Sequelize.DATE
        },
        pum_first_name: {
          type: Sequelize.STRING(50)
        },
        pum_email: {
          type: Sequelize.STRING(50)
        },
        pum_phone: {
          type: Sequelize.STRING(20)
        },
        stripe_card_number: {
          type: Sequelize.STRING(50)
        },
        stack_email: {
          type: Sequelize.STRING(100)
        },
        stack_reference: {
          type: Sequelize.STRING(100)
        },
        bank_receipt: {
          type: Sequelize.STRING(100)
        },
        card_cvv: {
          type: Sequelize.STRING(20)
        },
        expire_month: {
          type: Sequelize.STRING(20)
        },
        expire_year: {
          type: Sequelize.STRING(20)
        },
        note: {
          type: Sequelize.BOOLEAN
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING
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
     await queryInterface.dropTable('transactions');
  }
};
