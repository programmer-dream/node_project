module.exports = (sequelize, Sequelize) => {
  const Marks = sequelize.define("marks", {
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
        exam_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        class_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        section_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        subject_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        academic_year_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        grade_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        written_mark: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        written_obtain: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        tutorial_mark: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        tutorial_obtain: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        practical_mark: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        practical_obtain: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        viva_mark: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        viva_obtain: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        exam_total_mark: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        obtain_total_mark: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        remark: {
          type: Sequelize.INTEGER
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        subject_code: {
          type: Sequelize.INTEGER,
          allowNull: false
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
        }
    },{
        tableName: 'marks',
        createdAt: 'created_at',
        updatedAt: 'modified_at'
      }
  );
  
  return Marks;
};