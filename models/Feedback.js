module.exports = (sequelize, Sequelize) => {
  const Feedback = sequelize.define("feedback", {
        feedback_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('open','closed'),
        allowNull: false
      },
      feedback_type: {
        type: Sequelize.ENUM('complaint','discipline','performanceUpdate','recommendation'),
        allowNull: false,
      },
      open_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      close_date: {
        type: Sequelize.DATE
      },
      branch_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      related_to: {
        type: Sequelize.STRING,
        allowNull: false
      },
      related_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      open_to_comment: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default:0
      },
      remarks: {
        type: Sequelize.TEXT
      },
      feedback_rating: {
        type: Sequelize.INTEGER
      },
      meeting_vls_id: {
        type: Sequelize.INTEGER
      },
      closed_by: {
        type: Sequelize.INTEGER
      },
      closed_user_type: {
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
        tableName: 'feedback',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return Feedback;
};