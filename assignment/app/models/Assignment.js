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
        student_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
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
        root_assignment_question_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        no_of_assignments_submitted: {
          allowNull: false,
          type: Sequelize.STRING
        },
        no_of_assignments_rejected: {
          allowNull: false,
          type: Sequelize.STRING
        },
        assignment_level: {
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
      tableName: 'assignment'
    }
  );
  
  return Assignment;
};