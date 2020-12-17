module.exports = (sequelize, Sequelize) => {
  const Authentication = sequelize.define("users", {
    auth_vls_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    recovery_email_id: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    role_id: {
      type: Sequelize.INTEGER
    },
    user_name: {
      type: Sequelize.INTEGER
    },
    old_passwords: {
      type: Sequelize.INTEGER
    },
    forget_pwd_token: {
      type: Sequelize.STRING
    },
    password_reset_type: {
      type: Sequelize.STRING
    }
  },{
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  
  return Authentication;
};