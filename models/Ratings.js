module.exports = (sequelize, Sequelize) => {
  const RatingsQuery = sequelize.define("rating_like_query", {
    rating_like_query_id: {
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
      tableName: 'rating_like_query',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return RatingsQuery;
};