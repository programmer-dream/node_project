module.exports = (sequelize, Sequelize) => {
  const StudentAssignmentResponse = sequelize.define("student_assignment_response", {
        id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      assignment_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question_type: {
        type: Sequelize.ENUM('form', 'choice', 'multiple_checklist'),
        allowNull: false
      },
      response: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      assessment: {
        type: Sequelize.STRING,
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
      tableName: 'student_assignment_response',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return StudentAssignmentResponse;
};