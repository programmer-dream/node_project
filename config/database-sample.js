module.exports = {
  development: {
    host: "localhost",
    username: "root",
    password: "pass@1234",
    database: "vlsdev",
    dialect: "mysql",
    dialectOptions: {
      charset: 'latin1',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: "",
    password: "",
    database: "",
    host: "",
    dialect: 'mysql',
    dialectOptions: {
      charset: 'latin1',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
