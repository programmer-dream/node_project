module.exports = (sequelize, Sequelize) => {
  const AcademicYear = sequelize.define("academic_years", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    school_id: {
      type: Sequelize.INTEGER
    },
    session_year: {
      type: Sequelize.STRING(50)
    },
    start_year: {
      type: Sequelize.INTEGER
    },
    end_year: {
      type: Sequelize.INTEGER
    },
    note: {
      type: Sequelize.TEXT
    },
    is_running: {
      type: Sequelize.TINYINT(1)
    },
    status: {
      type: Sequelize.TINYINT(1)
    },
    created_by: {
      type: Sequelize.INTEGER
    },
    modified_by: {
      type: Sequelize.INTEGER
    },
  },{
    tableName: 'academic_years',
    createdAt: 'created_at',
    updatedAt: 'modified_at'
  }
  );

  return AcademicYear;
};