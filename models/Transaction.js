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
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_role: {
        type: Sequelize.STRING(30)
      },
      salary_grade_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      academic_year_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      expenditure_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      salary_type: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      salary_month: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      basic_salary: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      house_rent: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      transport: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      medical: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      bonus: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      over_time_hourly_rate: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      over_time_total_hour: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      over_time_amount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      provident_fund: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      penalty: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      hourly_rate: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue:0.00
      },
      total_hour: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      gross_salary: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      total_allowance: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      total_deduction: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      net_salary: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      cheque_no: {
        type: Sequelize.STRING(50)
      },
      bank_name: {
        type: Sequelize.STRING(1000)
      },
      payment_to: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      note: {
        allowNull: false,
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
    },{
        tableName: 'transactions',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return Transaction;
};