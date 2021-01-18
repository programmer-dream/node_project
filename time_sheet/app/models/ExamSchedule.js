module.exports = (sequelize, Sequelize) => {
  const ExamSchedule = sequelize.define("exam_schedules", {
    id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        exam_vls_id: {
          allowNull: false,
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
        class_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        subject_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        academic_year_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        exam_date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        start_time: {
          allowNull: false,
          type: Sequelize.STRING(20)
        },
        end_time: {
          allowNull: false,
          type: Sequelize.STRING(20)
        },
        room_no: {
          allowNull: false,
          type: Sequelize.STRING(20)
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
        },
        subject_code: {
          allowNull: false,
          type: Sequelize.STRING
        }
  },{
      tableName: 'exam_schedules',
      createdAt: 'created_at',
      updatedAt: 'modified_at'
    }
  );
  
  return ExamSchedule;
};