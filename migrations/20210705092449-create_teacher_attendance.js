'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teacher_attendance', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      academic_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      day_1: {
        type: Sequelize.STRING(1)
      },
      day_2: {
        type: Sequelize.STRING(1)
      },
      day_3: {
        type: Sequelize.STRING(1)
      },
      day_4: {
        type: Sequelize.STRING(1)
      },
      day_5: {
        type: Sequelize.STRING(1)
      },
      day_6: {
        type: Sequelize.STRING(1)
      },
      day_7: {
        type: Sequelize.STRING(1)
      },
      day_8: {
        type: Sequelize.STRING(1)
      },
      day_9: {
        type: Sequelize.STRING(1)
      },
      day_10: {
        type: Sequelize.STRING(1)
      },
      day_11: {
        type: Sequelize.STRING(1)
      },
      day_12: {
        type: Sequelize.STRING(1)
      },
      day_13: {
        type: Sequelize.STRING(1)
      },
      day_14: {
        type: Sequelize.STRING(1)
      },
      day_15: {
        type: Sequelize.STRING(1)
      },
      day_16: {
        type: Sequelize.STRING(1)
      },
      day_17: {
        type: Sequelize.STRING(1)
      },
      day_18: {
        type: Sequelize.STRING(1)
      },
      day_19: {
        type: Sequelize.STRING(1)
      },
      day_20: {
        type: Sequelize.STRING(1)
      },
      day_21: {
        type: Sequelize.STRING(1)
      },
      day_22: {
        type: Sequelize.STRING(1)
      },
      day_23: {
        type: Sequelize.STRING(1)
      },
      day_24: {
        type: Sequelize.STRING(1)
      },
      day_25: {
        type: Sequelize.STRING(1)
      },
      day_26: {
        type: Sequelize.STRING(1)
      },
      day_27: {
        type: Sequelize.STRING(1)
      },
      day_28: {
        type: Sequelize.STRING(1)
      },
      day_29: {
        type: Sequelize.STRING(1)
      },
      day_30: {
        type: Sequelize.STRING(1)
      },
      day_31: {
        type: Sequelize.STRING(1)
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      modified_by: {
        type: Sequelize.INTEGER
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
 
     await queryInterface.dropTable('teacher_attendance');
  }
};
