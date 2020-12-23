module.exports = (sequelize, Sequelize) => {
  const RatingsQuery = sequelize.define("rating_like_learning_library", {
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
      query_vls_id: {
        type: Sequelize.INTEGER
      }
  },{
      tableName: 'rating_like_learning_library',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return RatingsQuery;
};