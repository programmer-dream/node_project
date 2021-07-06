module.exports = (sequelize, Sequelize) => {
  const TeacherAbsent = sequelize.define("teacher_absent", {
     id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      date_of_absent: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
  },{
      tableName: 'teacher_absent',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
  return TeacherAbsent;
};