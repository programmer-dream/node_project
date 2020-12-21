module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
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
      query_vls_id: {
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
      tableName: 'comments',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
  return Comment;
};