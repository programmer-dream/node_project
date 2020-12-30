module.exports = (sequelize, Sequelize) => {
  const StudentAbsent = sequelize.define("student_absent", {
     id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        type: Sequelize.INTEGER
      },
      branch_id: {
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.INTEGER
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      reason: {
        type: Sequelize.TEXT
      },
      date_of_absent: {
        type: Sequelize.DATEONLY
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      modified_by: {
        type: Sequelize.INTEGER
      }
  },{
      tableName: 'student_absent',
      createdAt: 'created_at',
      updatedAt: 'modified_at'
    });
  
  return StudentAbsent;
};