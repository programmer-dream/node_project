module.exports = (sequelize, Sequelize) => {
  const StudentAttendance = sequelize.define("student_attendances", {
    attendance_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      student_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      academic_year_id  : {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      class_id  : {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      section_id  : {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      month: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      year: {
        allowNull: false,
        type: Sequelize.STRING(10)
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      modified_by: {
        type: Sequelize.INTEGER
      },
      subject_code: {
        type: Sequelize.STRING,
        
      } 
  },{
    tableName: 'student_attendances',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  return StudentAttendance;
};