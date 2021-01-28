module.exports = (sequelize, Sequelize) => {
  const AssignmentQuestions = sequelize.define("assignment_questions", {
        assignment_question_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        assignment_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        question_type: {
          allowNull: false,
          type: Sequelize.ENUM('Form','Choice','MultipleChecklist')
        },
        question: {
          allowNull: false,
          type: Sequelize.STRING
        },
        assessment: {
          allowNull: false,
          type: Sequelize.STRING
        },
        choice1: {
          type: Sequelize.STRING
        },
        choice2: {
          type: Sequelize.STRING
        },
        choice3: {
          type: Sequelize.STRING
        },
        choice4: {
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
      tableName: 'assignment_questions',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return AssignmentQuestions;
};