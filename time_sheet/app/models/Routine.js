module.exports = (sequelize, Sequelize) => {
  const Routine = sequelize.define("routines", {
    timesheet_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      class_id: {
        type: Sequelize.INTEGER
      },
      section_id: {
        type: Sequelize.INTEGER
      },
      subject_id: {
        type: Sequelize.INTEGER
      },
      teacher_id: {
        type: Sequelize.INTEGER
      },
      academic_year_id: {
        type: Sequelize.INTEGER
      },
      day: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.STRING
      },
      end_time: {
        type: Sequelize.STRING
      },
      room_no: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.TINYINT(1)
      }
  },{
      tableName: 'routines',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return Routine;
};