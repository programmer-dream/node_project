module.exports = (sequelize, Sequelize) => {
  const LearningLibraryComment = sequelize.define("video_learning_library_comments", {
     id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      video_learning_library_vls_id: {
        type: Sequelize.INTEGER
      },
      user_vls_id: {
        type: Sequelize.INTEGER
      },
      user_type: {
        type: Sequelize.STRING
      },
      reply_vls_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.TINYINT(1)
      },
      comment_body: {
        allowNull: true,
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
      tableName: 'video_learning_library_comments',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
  return LearningLibraryComment;
};