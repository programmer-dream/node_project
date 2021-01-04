module.exports = (sequelize, Sequelize) => {
  const StudentQuery = sequelize.define("student_query", {
    query_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      student_vls_id: {
        type: Sequelize.INTEGER
      },
      class_vls_id: {
        type: Sequelize.INTEGER
      },
      query_type: {
        type: Sequelize.STRING
      },
      query_date: {
        type: Sequelize.STRING
      },
      query_status: {
        type: Sequelize.ENUM('open','Inprogress','Closed','Rejected')
      },
      topic: {
        type: Sequelize.INTEGER
      },
      subject_id: {
        type: Sequelize.STRING
      },
      query_level: {
        type: Sequelize.ENUM('Basic', 'Intermediate','Expert')
      },
      headline: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      response: {
        type: Sequelize.STRING
      },
      response_date: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      faculty_vls_id: {
        type: Sequelize.INTEGER
      },
      is_comment: {
        type: Sequelize.BOOLEAN
      }
  },{
      tableName: 'student_query',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return StudentQuery;
};