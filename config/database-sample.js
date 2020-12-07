module.exports = {
  development: {
    host: "",
    username: "",
    password: "",
    database: "",
    dialect: "mysql",
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
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
