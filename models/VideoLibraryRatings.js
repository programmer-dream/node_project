module.exports = (sequelize, Sequelize) => {
  const RatingsQuery = sequelize.define("rating_like_videos_learning_library", {
    rating_like_learning_library_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ratings: {
        type: Sequelize.INTEGER
      },
      likes: {
        type: Sequelize.BOOLEAN
      },
      user_vls_id: {
        type: Sequelize.BIGINT
      },
      video_learning_library_vls_id : {
        type: Sequelize.INTEGER
      },
      user_type:{
        type: Sequelize.STRING
      }
  },{
      tableName: 'rating_like_videos_learning_library',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return RatingsQuery;
};