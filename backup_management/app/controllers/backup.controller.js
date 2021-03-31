const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const dbConfig 	 = require("../../../config/database.js");
const env 		 = require("../../../config/env.js");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mysqlDump  = require('mysqldump')
const { exec } = require('child_process');
const fs 		 = require('fs');
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const AcademicYear  = db.AcademicYear;
const School  		= db.SchoolDetails;


module.exports = {
  academicYears,
  exportData,
  importData,
  listDirectories
};



/**
 * API for academic years list
 */
async function academicYears(params , user){

  let academicYears = await AcademicYear.findAll()

  return { success: true, message: "Academic years list", data: academicYears}
};


/**
 * API for  export data
 */
async function exportData(params , user){
	let date 		  	= moment().format('YYYY_MM_DD')
	let conectionParmas = await getDbParams()
	let allSchool     	= await School.findAll({
		attributes: ['school_id','school_name']
	})
	let exportTables  = ['academic_years','assignment','assignment_questions','branch_details','chat','classes','comments','community_chat', 'community_chat_communicaiton','community_rating_like','employees','exams','exam_schedules','feedback','guardians','learning_library','learning_library_comments','marks','meetings','notification','notification_read_by','rating_like_learning_library','rating_like_query','routines','sections','student_absent','students','student_assignment','student_assignment_response','student_attendances','student_learning_library','student_query','subjects','subject_list','tickets','ticket_comments','ticket_rating','users','user_settings']

	let dirpath = './uploads/backup_'+date
	if( !fs.existsSync(dirpath) ){
	    fs.mkdirSync(dirpath, { recursive: true })
	}
	//export school wise funcion
	await Promise.all(
	    allSchool.map( async (school) => {
	    let schoolName = school.school_name.split(" ").join("_")+"_"+school.school_id+"_"+date
	    let school_vls_id = school.school_id

	    let whereObject = {
			'academic_years' : 'school_id ='+school_vls_id,
			'assignment'     : 'school_vls_id ='+school_vls_id,
			'assignment_questions' : 'school_vls_id ='+school_vls_id,
			'branch_details' : 'school_vls_id ='+school_vls_id,
			'chat' : 'school_vls_id ='+school_vls_id,
			'classes' : 'school_id ='+school_vls_id,
			'comments' : 'school_vls_id ='+school_vls_id,
			'community_chat' : 'school_vls_id ='+school_vls_id,
			'community_chat_communicaiton' : 'school_vls_id ='+school_vls_id,
			'community_rating_like' : 'school_vls_id ='+school_vls_id,
			'employees' : 'school_vls_id ='+school_vls_id,
			'exams' : 'school_vls_id ='+school_vls_id,
			'exam_schedules' : 'school_id ='+school_vls_id,
			'feedback' : 'school_vls_id ='+school_vls_id,	
			'guardians' : 'school_vls_id ='+school_vls_id,	
			'learning_library' : 'school_vls_id ='+school_vls_id,	
			'learning_library_comments' : 'school_vls_id ='+school_vls_id,	
			'marks' : 'school_id ='+school_vls_id,	
			'meetings' : 'school_id ='+school_vls_id,	
			'notification' : 'school_vls_id ='+school_vls_id,	
			'notification_read_by' : 'school_vls_id ='+school_vls_id,	
			'rating_like_learning_library' : 'school_vls_id ='+school_vls_id,	
			'rating_like_query' : 'school_vls_id ='+school_vls_id,	
			'routines' : 'school_vls_id ='+school_vls_id,	
			'sections' : 'school_id ='+school_vls_id,	
			'student_absent' : 'school_id ='+school_vls_id,	
			'students' : 'school_id ='+school_vls_id,	
			'student_assignment' : 'school_vls_id ='+school_vls_id,	
			'student_assignment_response' : 'school_vls_id ='+school_vls_id,	
			'student_attendances' : 'school_id ='+school_vls_id,	
			'student_learning_library' : 'school_vls_id ='+school_vls_id,	
			'student_query' : 'school_vls_id ='+school_vls_id,	
			'subjects' : 'school_id ='+school_vls_id,	
			'subject_list' : 'school_vls_id ='+school_vls_id,	
			'tickets' : 'school_vls_id ='+school_vls_id,	
			'ticket_comments' : 'school_vls_id ='+school_vls_id,	
			'ticket_rating' : 'school_vls_id ='+school_vls_id,	
			'users' : 'school_id ='+school_vls_id,	
			'user_settings' : 'school_vls_id ='+school_vls_id,	
		}
			let delQuery = await deleteQuery(whereObject)
			let fileName = dirpath+'/dump_'+schoolName+'.sql'

			mysqlDump({
			    connection: conectionParmas,
				dumpToFile: dirpath+'/dump_'+schoolName+'.sql',
				dump:{
				    	schema : false,
				    	tables : exportTables,
				    	data:{
				    		maxRowsPerInsertStatement:100,
				    		where:whereObject
				    	}
				}
			})
			//add delete query
			var data = fs.readFileSync(fileName);
			var fd = fs.openSync(fileName, 'w+');
			fs.writeSync(fd, delQuery, 0, delQuery.length, 0); 
			fs.writeSync(fd, data, 0, data.length, delQuery.length);
	  })
    )
    //all school dump
    mysqlDump({
	    connection: conectionParmas,
		dumpToFile: dirpath+'/all_db_'+date+'.sql',
		dump:{
			schema : {
				table :{
					dropIfExist : true
				}
			},
	    	data:{
	    		maxRowsPerInsertStatement:100,
	    	}
		}
	})
  return { success: true, message: "Data exported"}
};

/**
 * API for  import data
 */
async function importData(params , user){
	if(!params.directory) throw 'directory is required'
	if(!params.filename) throw 'filename is required'
		
	let conectionParmas = await getDbParams()

	const host 		= conectionParmas.host;
	const dbuser 	= conectionParmas.user;
	const password 	= conectionParmas.password;
	const database 	= conectionParmas.database;

	let dir      	= params.directory
	let file      	= params.filename
	let dumpFile 	= './uploads/'+dir+"/"+file;
	
	exec(`mysql -u${dbuser} -p${password} -h ${host} ${database} < ${dumpFile}`, (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${err}`); return; }

        console.log(`The import has finished.`);
	});

 	return { success: true, message: "Data imported " }
};


/**
 * API for  import data
 */
async function deleteQuery(object){
	let conbineQuerys = '/* ------ Delete query ------ */ \n'
	Object.keys(object).forEach(function(table) {
	  let condition = object[table];
	  let query = 'DELETE FROM {table_name} WHERE {condition}'
	 	query = query.replace("{table_name}", table);
	 	query = query.replace("{condition}", condition);
	 	conbineQuerys += query+";\n"
	});
	return conbineQuerys+"/* ------ Delete query ------ */ \n"
}


/**
 * API for  import data
 */
async function listDirectories(params , user){	
	const uploadsFolder = './uploads';
	let allDirectories = {}
	let dir = fs.readdirSync(uploadsFolder);

	dir.forEach(dir => {
		if(!dir.includes('.DS_Store')){
		    if(!allDirectories.dir)
		    	allDirectories[dir] = []
		    if(fs.lstatSync('./uploads/'+dir).isDirectory()){
		    	let dirIn = fs.readdirSync('./uploads/'+dir);
		    	dirIn.forEach(file => {
		    		if(file.includes('.sql'))
		    			allDirectories[dir].push(file)
		    	})
		    }
		}
	});

 	return { success: true, message: "List directories ", data : allDirectories }
};

/**
 * API for  get db params 
 */
function getDbParams(){
	let environment = env.environmnet
	let dbParams = {}

	if(environment == "production"){
		dbParams.host= dbConfig.production.host
        dbParams.user= dbConfig.production.username
        dbParams.password= dbConfig.production.password
        dbParams.database= dbConfig.production.database
	}else{
		dbParams.host= dbConfig.development.host
        dbParams.user= dbConfig.development.username
        dbParams.password= dbConfig.development.password
        dbParams.database= dbConfig.development.database 
	}

	return dbParams
}