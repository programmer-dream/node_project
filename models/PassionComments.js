module.exports = (sequelize, Sequelize) => {
  const PassionComment = sequelize.define("passion_comments", {
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
      passion_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue : 0
      },
      comment_body: {
        type: Sequelize.TEXT,
        allowNull: false
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
    tableName: 'passion_comments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return PassionComment;
};