const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mysqlDump  = require('mysqldump')
const fs 		 = require('fs');
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const AcademicYear  = db.AcademicYear;


module.exports = {
  academicYears,
  exportData
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
	mysqlDump({
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Password@123',
        database: 'dev_vls'
	    },
	    dumpToFile: './uploads/dump.sql.gz',
	    compressFile: true,
	    dump:{
	    	tables:['assignment']
	    },
	    dataDump:{
	    	where:{
	    		'assignment':'assignment_vls_id < 40'
	    	}
	    }
	});
	
  return { success: true, message: "Data exported "}
};


