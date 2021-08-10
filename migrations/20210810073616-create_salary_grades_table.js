'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('salary_grades', {
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
      grade_name: {
        allowNull: false,
        type: Sequelize.STRING(50)
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
      over_time_hourly_rate: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      provident_fund: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      hourly_rate: {
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
      gross_salary: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      net_salary: {
        allowNull: false,
        type: Sequelize.FLOAT
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
      await queryInterface.dropTable('salary_grades');
  }
};
