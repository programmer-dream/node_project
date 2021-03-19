module.exports = (sequelize, Sequelize) => {
  const StudentAssignment = sequelize.define("student_assignment", {
        student_assignment_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        student_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        school_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        branch_vls_id: {
          type: Sequelize.INTEGER
        },
        assignment_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        assignment_status: {
          allowNull: false,
          type: Sequelize.ENUM('New','Inprogress','Submitted','ValidationInprogress','Approved','Rejected','Closed')
        },
        submission_date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        assessment: {
          type: Sequelize.STRING
        },
        teacher_comment: {
          type: Sequelize.STRING
        },
        url: {
          type: Sequelize.STRING
        },
        comments: {
          type: Sequelize.TEXT
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
      tableName: 'student_assignment',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return StudentAssignment;
};