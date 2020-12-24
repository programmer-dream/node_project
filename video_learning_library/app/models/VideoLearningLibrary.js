module.exports = (sequelize, Sequelize) => { 
  const VideoLearningLibrary = sequelize.define("video_learning_library", {
    video_learning_library_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
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
      video_format: {
        type: Sequelize.STRING
      },
      video_size: {
        type: Sequelize.STRING
      },
      recommended_student_level: {
        type: Sequelize.STRING
      },
      video_library_level: {
        type: Sequelize.ENUM('Basic', 'Intermediate','Expert')
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
      reply_vls_id: {
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
    tableName: 'video_learning_library',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return VideoLearningLibrary;
};