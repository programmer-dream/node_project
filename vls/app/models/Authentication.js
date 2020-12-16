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
    old_password1: {
      type: Sequelize.INTEGER
    },
    old_password2: {
      type: Sequelize.INTEGER
    },
    old_password3: {
      type: Sequelize.INTEGER
    }
  },{
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );
  Authentication.associate = function(models) {
    Authentication.hasOne(models.Role, {foreignKey: 'role_id', as: 'roles'})
  };
  return Authentication;
};