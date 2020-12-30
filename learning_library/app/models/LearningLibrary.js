module.exports = (sequelize, Sequelize) => {
  const LearningLibrary = sequelize.define("learning_library", {
    learning_library_vls_id: {
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
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      topic: {
        type: Sequelize.STRING
      },
      URL: {
        type: Sequelize.STRING
      },
      document_type: {
        type: Sequelize.STRING
      },
      document_size: {
        type: Sequelize.STRING
      },
      recommended_student_level: {
        type: Sequelize.ENUM('Basic','Intermediate','Expert')
      },
      library_level: {
        type: Sequelize.STRING
      },
      ratings: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.STRING
      },
      is_comment: {
        type: Sequelize.BOOLEAN
      },
      cover_photo: {
        type: Sequelize.BOOLEAN
      }
  },{
    tableName: 'learning_library',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return LearningLibrary;
};