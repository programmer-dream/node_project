const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mysqlDump  = require('mysqldump')
const Importer = require('mysql-import');
const fs 		 = require('fs');
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const AcademicYear  = db.AcademicYear;


module.exports = {
  academicYears,
  exportData,
  importData
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
	let date 		  = moment().format('YYYY_MM_DD')
	let school_vls_id = 1
	let exportTables  = ['academic_years','assignment','']
	mysqlDump({
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Password@123',
        database: 'dev_vls'
	    },
	dumpToFile: './uploads/dump_'+date+'.sql',
	dump:{
	    	schema : false,
	    	tables : exportTables,
	    	data:{
	    		maxRowsPerInsertStatement:100,
	    		where:{
	    			'academic_years' : 'school_id ='+school_vls_id,
	    			'assignment'     : 'school_vls_id ='+school_vls_id
	    		}
	    	}
	}
	});
	
  return { success: true, message: "Data exported"}
};

/**
 * API for  import data
 */
async function importData(params , user){	
	const host 		= 'localhost';
	const dbuser 	= 'root';
	const password 	= 'Password@123';
	const database 	= 'backup_vls';

	// exec(`mysql -u${importTo.user} -p${importTo.password} -h ${importTo.host} ${importTo.database} < ${dumpFile}`, (err, stdout, stderr) => {
 //        if (err) { console.error(`exec error: ${err}`); return; }

 //        console.log(`The import has finished.`);
	// });
	const uploadsFolder = './uploads/';

	// let allFiles = []
	// fs.promise.readdir(uploadsFolder, (err, files) => {
	// 	allFiles.push(files)
	// 	console.log(allFiles)
	// })
	let allFiles = []
	let files = fs.readdirSync(uploadsFolder);

	files.forEach(file => {
		if(file.includes('.sql'))
	    	allFiles.push(file);
	});

 	return { success: true, message: "Data imported ", data : allFiles }
};
