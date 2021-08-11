module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define("transactions", {
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
      invoice_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      bank_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cheque_no: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      transaction_id: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      payment_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      pum_first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pum_email: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      pum_phone: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      stripe_card_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      stack_email: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      stack_reference: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bank_receipt: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      card_cvv: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      expire_month: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      expire_year: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      note: {
        type: Sequelize.STRING
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
    },{
        tableName: 'transactions',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return Transaction;
};