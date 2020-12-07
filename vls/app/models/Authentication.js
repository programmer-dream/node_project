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
    }
  },{
    tableName: 'Authentication'
  }
  );

  return Authentication;
};