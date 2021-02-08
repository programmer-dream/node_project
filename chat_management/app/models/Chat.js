module.exports = (sequelize, Sequelize) => {
  const Chat = sequelize.define("chat", {
        chat_vls_id: {
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
        sender_user_vls_id: {
          type: Sequelize.INTEGER
        },
        receiver_user_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        chat_message: {
          allowNull: false,
          type: Sequelize.STRING
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING
        },
        attachment: {
          type: Sequelize.STRING
        },
        attachmentType: {
          type: Sequelize.ENUM('image','document')
        },
        sender_type: {
          type: Sequelize.ENUM('employee','student','guardian')
        },
        receiver_type: {
          type: Sequelize.ENUM('employee','student','guardian')
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
        tableName: 'chat',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return Chat;
};