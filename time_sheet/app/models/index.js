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
db.Routine = require("./Routine.js")(sequelize, Sequelize);
db.Subject = require("./Subject.js")(sequelize, Sequelize);
db.Meeting = require("./Meeting.js")(sequelize, Sequelize);
db.ExamSchedule = require("./ExamSchedule.js")(sequelize, Sequelize);
db.Exam = require("./Exam.js")(sequelize, Sequelize);
db.SubjectList = require("../../../query_management/app/models/SubjectList.js")(sequelize, Sequelize);
db.Assignment = require("../../../assignment/app/models/Assignment.js")(sequelize, Sequelize);

//Relation
db.Routine.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subjectList'})

db.ExamSchedule.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subject'})
db.Routine.belongsTo(db.Employee,{foreignKey:'teacher_id',as:'teacher'})
db.ExamSchedule.belongsTo(db.Exam,{foreignKey:'exam_vls_id',as:'exam'})
db.Student.belongsTo(db.Guardian,{foreignKey:'parent_vls_id',as:'parent'})
db.Meeting.belongsTo(db.Employee,{foreignKey:'meeting_author_vls_id',as:'addedBy'})
db.Assignment.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subject'})

module.exports = db;
