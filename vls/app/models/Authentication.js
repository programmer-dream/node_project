module.exports = (sequelize, Sequelize) => {
  const Authentication = sequelize.define("Authentication", {
    authVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    recoveryEmailId: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    userType: {
      type: Sequelize.ENUM('Student','Faculty','Parent','Admin')
    },
    userId: {
      type: Sequelize.INTEGER
    },
    oldPassword1: {
      type: Sequelize.INTEGER
    },
    oldPassword2: {
      type: Sequelize.INTEGER
    },
    oldPassword3: {
      type: Sequelize.INTEGER
    }
  },{
    tableName: 'Authentication'
  }
  );

  return Authentication;
};