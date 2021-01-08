const dbConfig = require("../../../config/database.js");
const env = require("../../../config/env.js");

const envMode = env.environmnet

let DB
let user
let password
let host
let dialect
let poolMax
let poolMin
let poolAcquire
let poolIdle

if(envMode == "production"){
	DB = dbConfig.production.database
	user = dbConfig.production.username
	passowrd = dbConfig.production.password
	host = dbConfig.production.host
	dialect = dbConfig.production.dialect
	poolMax = dbConfig.production.pool.max
	poolMin = dbConfig.production.pool.min
	poolAcquire = dbConfig.production.pool.acquire
	poolIdle = dbConfig.production.pool.idle
}else{
	DB = dbConfig.development.database
	user = dbConfig.development.username
	passowrd = dbConfig.development.password
	host = dbConfig.development.host
	dialect = dbConfig.development.dialect
	poolMax = dbConfig.development.pool.max
	poolMin = dbConfig.development.pool.min
	poolAcquire = dbConfig.development.pool.acquire
	poolIdle = dbConfig.development.pool.idle
}

const Sequelize = require("sequelize");
const sequelize = new Sequelize(DB, user, passowrd, {
  host: host,
  dialect: dialect,

  pool: {
    max: poolMax,
    min: poolMin,
    acquire: poolAcquire,
    idle: poolIdle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize.authenticate()
	.then(function(err) {
 		console.log('Connection has been established successfully.');
	}, function (err) {
 		console.log('Unable to connect to the database:', err);
	}
);

db.Employee = require("../../../vls/app/models/Employee.js")(sequelize, Sequelize);
db.Student = require("../../../vls/app/models/Student.js")(sequelize, Sequelize);
db.Branch = require("../../../vls/app/models/Branch.js")(sequelize, Sequelize);
db.Guardian = require("../../../vls/app/models/Guardian.js")(sequelize, Sequelize);
db.StudentAttendance = require("./StudentAttendance.js")(sequelize, Sequelize);
db.Classes = require("./Classes.js")(sequelize, Sequelize);
db.Section = require("./Section.js")(sequelize, Sequelize);
db.AcademicYear = require("./AcademicYear.js")(sequelize, Sequelize);
db.Authentication = require("../../../vls/app/models/Authentication.js")(sequelize, Sequelize);
db.StudentAbsent = require("./StudentAbsent.js")(sequelize, Sequelize);
db.Subject = require("../../../query_management/app/models/Subject.js")(sequelize, Sequelize);

//relatons
db.Classes.hasMany(db.Section,{foreignKey:'class_id',as:'sections'})
db.StudentAttendance.belongsTo(db.Student,{foreignKey:'student_id',as:'student'})
db.Student.belongsTo(db.Guardian,{foreignKey:'parent_vls_id',as:'parent'})

module.exports = db;