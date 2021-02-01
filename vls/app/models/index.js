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

db.Authentication = require("./Authentication.js")(sequelize, Sequelize);
db.SchoolDetails = require("./School.js")(sequelize, Sequelize);
db.Role = require("./Role.js")(sequelize, Sequelize);
db.Student = require("./Student.js")(sequelize, Sequelize);
db.Guardian = require("./Guardian.js")(sequelize, Sequelize);
db.Employee = require("./Employee.js")(sequelize, Sequelize);
db.Branch = require("./Branch.js")(sequelize, Sequelize);
db.UserSetting = require("./UserSetting.js")(sequelize, Sequelize);

db.Authentication.belongsTo(db.Role,{foreignKey:'role_id',as:'roles'})
db.Authentication.belongsTo(db.SchoolDetails,{foreignKey:'school_id',as:'school'})
db.Authentication.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branch'})
db.Authentication.hasOne(db.UserSetting,{foreignKey:'user_settings_vls_id',as:'userSetting'})

db.Employee.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branchDetails'})
db.Guardian.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branchDetailsGuardian'})
db.Student.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branchDetailsStudent'})
db.Branch.belongsTo(db.SchoolDetails,{foreignKey:'school_vls_id',as:'schoolDetails'})
//db.Role.belongsTo(db.Authentication,{foreignKey:'role_id',as:'roles'})
module.exports = db;



// Example for connection 

// Include Sequelize module 
// const Sequelize = require('sequelize') 
// require('dotenv').config()

// // Creating new Object of Sequelize 
// const sequelize = new Sequelize( 
// 	process.env.DB_NAME, 
// 	process.env.DB_USER, 
// 	process.env.DB_PASS, { 

// 		// Explicitly specifying 
// 		// mysql database 
// 		dialect: 'mysql', 

// 		// By default host is 'localhost'		 
// 		host: process.env.DB_HOST
// 	} 
// ); 

// // Exporting the sequelize object. 
// // We can use it in another file 
// // for creating models 
// module.exports = sequelize 
