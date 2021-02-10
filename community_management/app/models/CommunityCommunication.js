module.exports = (sequelize, Sequelize) => {
  const communityChatCommunicaiton = sequelize.define("community_chat_communicaiton", {
        community_chat_communication_vls_id: {
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
        community_chat_vls_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        comment_body: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        sender_type: {
          allowNull: false,
          type: Sequelize.STRING
        },
        sender_user_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        reply_date: {
          type: Sequelize.DATE
        },
        file_url: {
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
        tableName: 'community_chat_communicaiton',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return communityChatCommunicaiton;
};