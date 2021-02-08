module.exports = (sequelize, Sequelize) => {
  const CommunityChat = sequelize.define("community_chat", {
        community_chat_vls_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        school_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        branch_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        group_name: {
          type: Sequelize.STRING
        },
        group_type: {
          allowNull: false,
          type: Sequelize.STRING
        },
        user_list: {
          allowNull: false,
          type: Sequelize.STRING
        },
        group_admin_user_id_list: {
          allowNull: false,
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
        is_commented: {
          type: Sequelize.TINYINT,
          allowNull: false,
          defaultValue: 0
        },
        start_date: {
          type: Sequelize.DATE
        },
        community_status: {
          type: Sequelize.ENUM('Active','Deleted')
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
        tableName: 'community_chat',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return CommunityChat;
};