module.exports = (sequelize, Sequelize) => {
  const CommunityRatingLike = sequelize.define("community_rating_like", {
        id: {
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
      user_type: {
        type: Sequelize.STRING
      },
      community_chat_vls_id: {
        type: Sequelize.INTEGER
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
        tableName: 'community_rating_like',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return CommunityRatingLike;
};