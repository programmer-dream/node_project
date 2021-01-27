module.exports = (sequelize, Sequelize) => {
  const Assignment = sequelize.define("assignment", {
        assignment_vls_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        branch_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        school_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        student_vls_ids: {
          type: Sequelize.TEXT
        },
        assignment_class_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        assignment_date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        assignment_completion_date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        assignment_type: {
          type: Sequelize.ENUM('online','offline')
        },
        url: {
          allowNull: false,
          type: Sequelize.STRING
        },
        added_by: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        total_marks: {
          allowNull: false,
          type: Sequelize.STRING
        },
        user_role: {
          allowNull: false,
          type: Sequelize.STRING
        },
        assignment_level: {
          allowNull: false,
          type: Sequelize.STRING
        },
        subject_code: {
          allowNull: false,
          type: Sequelize.STRING
        },
        section_id: {
          allowNull: false,
          type: Sequelize.STRING
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
  },{
      tableName: 'assignment',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return Assignment;
};