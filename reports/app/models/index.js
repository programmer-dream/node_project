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
let dialectOptions

if(envMode == "production"){
	DB = dbConfig.production.database
	user = dbConfig.production.username
	passowrd = dbConfig.production.password
	host = dbConfig.production.host
	dialect = dbConfig.production.dialect
	dialectOptions = dbConfig.production.dialectOptions
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
	dialectOptions = dbConfig.development.dialectOptions
	poolMax = dbConfig.development.pool.max
	poolMin = dbConfig.development.pool.min
	poolAcquire = dbConfig.development.pool.acquire
	poolIdle = dbConfig.development.pool.idle
}

const Sequelize = require("sequelize");
const sequelize = new Sequelize(DB, user, passowrd, {
  host: host,
  dialect: dialect,
  dialectOptions:dialectOptions,
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


db.SchoolDetails = require("../../../vls/app/models/School.js")(sequelize, Sequelize);
db.Branch = require("../../../vls/app/models/Branch.js")(sequelize, Sequelize);
db.Student = require("../../../vls/app/models/Student.js")(sequelize, Sequelize);
db.Employee = require("../../../vls/app/models/Employee.js")(sequelize, Sequelize);
db.Authentication = require("../../../vls/app/models/Authentication.js")(sequelize, Sequelize);
db.AcademicYear = require("../../../student_attendance/app/models/AcademicYear.js")(sequelize, Sequelize);
db.Guardian = require("../../../vls/app/models/Guardian.js")(sequelize, Sequelize);
db.SubjectList = require("../../../query_management/app/models/SubjectList.js")(sequelize, Sequelize);
db.Classes = require("../../../student_attendance/app/models/Classes.js")(sequelize, Sequelize);
db.StudentAttendance = require("../../../student_attendance/app/models/StudentAttendance.js")(sequelize, Sequelize);
db.Subject = require("../../../query_management/app/models/Subject.js")(sequelize, Sequelize);
db.Section = require("../../../student_attendance/app/models/Section.js")(sequelize, Sequelize);


db.Exams = require("./Exams.js")(sequelize, Sequelize);
db.Marks = require("./Marks.js")(sequelize, Sequelize);

db.Exams.hasMany(db.Marks,{foreignKey:'exam_id',as:'marks'})
db.Marks.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey : 'code', as:'subject'})
db.StudentAttendance.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey : 'code', as:'subject'})
db.Marks.belongsTo(db.Student,{foreignKey:'student_id', as:'student'})
db.Student.belongsTo(db.Guardian,{foreignKey:'parent_vls_id', as:'guardian'})
db.Student.hasMany(db.Marks,{foreignKey:'student_id', as:'marks'})
db.Student.hasMany(db.StudentAttendance,{foreignKey:'student_id', as:'attendance'})
db.Marks.belongsTo(db.Exams,{foreignKey:'exam_id', as:'exam'})
db.Classes.hasMany(db.Marks,{foreignKey:'class_id', as:'marks'})
db.Classes.hasMany(db.Section,{foreignKey:'class_id', as:'section'})

module.exports = db;
