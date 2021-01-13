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

db.StudentQuery = require("./StudentQuery.js")(sequelize, Sequelize);
db.Comment = require("./Comment.js")(sequelize, Sequelize);
db.Ratings = require("./Ratings.js")(sequelize, Sequelize);
db.Employee = require("../../../vls/app/models/Employee.js")(sequelize, Sequelize);
db.Student = require("../../../vls/app/models/Student.js")(sequelize, Sequelize);
db.Branch = require("../../../vls/app/models/Branch.js")(sequelize, Sequelize);
db.Users = require("../../../vls/app/models/Authentication.js")(sequelize, Sequelize);
db.Subject = require("./Subject.js")(sequelize, Sequelize);
db.Classes = require("../../../student_attendance/app/models/Classes.js")(sequelize, Sequelize);
db.Section = require("../../../student_attendance/app/models/Section.js")(sequelize, Sequelize);
db.SubjectList = require("./SubjectList.js")(sequelize, Sequelize);

db.StudentQuery.belongsTo(db.Student,{foreignKey:'student_vls_id',as:'postedBy'})
db.StudentQuery.belongsTo(db.Employee,{foreignKey:'faculty_vls_id',as:'respondedBy'})
db.Ratings.belongsTo(db.Student,{foreignKey:'user_vls_id',as:'ratingBy'})
db.Ratings.belongsTo(db.Student,{foreignKey:'user_vls_id',as:'likeBy'})
db.Branch.hasMany(db.Subject,{foreignKey:'branch_vls_id',as:'subject'})
db.StudentQuery.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subjectList'})
db.StudentQuery.belongsTo(db.Subject,{foreignKey:'subject_code',targetKey:'code',as:'subject'})
db.StudentQuery.belongsTo(db.Classes,{foreignKey:'class_vls_id',as:'class'})
db.StudentQuery.belongsTo(db.Employee,{foreignKey:'faculty_vls_id',as:'faculty'})
db.Branch.hasMany(db.SubjectList,{foreignKey:'branch_vls_id',as:'subjectList'})
module.exports = db;
