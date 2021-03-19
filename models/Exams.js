module.exports = (sequelize, Sequelize) => {
  const Exams = sequelize.define("exams", {
        test_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        branch_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        test_type: {
          allowNull: false,
          type: Sequelize.STRING
        },
        start_date: {
          type: Sequelize.DATE
        },
        school_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        academic_year_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING(100)
        },
        note: {
          type: Sequelize.TEXT
        },
        status: {
          type: Sequelize.TINYINT(1)
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
          allowNull: false,
          type: Sequelize.INTEGER
        }
    },{
        tableName: 'exams',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return Exams;
};