module.exports = (sequelize, Sequelize) => {
  const Authentication = sequelize.define("Authentication", {
    AuthVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    RecoveryEmailId: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    userType: {
      type: Sequelize.ENUM('Student','Faculty','Parent','Admin')
    },
    UserId: {
      type: Sequelize.INTEGER
    }
  },{
    tableName: 'Authentication'
  }
  );

  return Authentication;
};