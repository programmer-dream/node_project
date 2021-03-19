let helper = {};
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const config = require("../../../config/env.js");
const db = require("../../../models");
const SchoolDetails = db.SchoolDetails;
const Branch        = db.Branch;


let storage = multer.diskStorage({
  destination: async function (req, file, cb) {

  let dirpath     = config.pdf_path
  let uplodedPath;
  let schoolVlsId = req.body.school_vls_id
  let branchVlsId = req.body.branch_vls_id
  if(!schoolVlsId) cb("schoolVlsId is requeried")
  if(!branchVlsId) cb("branchVlsId is requeried")

  let school  = await SchoolDetails.findOne({
          where:{school_vls_id:schoolVlsId}
  })
  var school_name = school.school_name;
  school_name = school_name.replace(/\s+/g, '-').toLowerCase();

  let branch  = await Branch.findOne({
          where:{branch_vls_id:branchVlsId}
  })
  var branch_name = branch.branch_name;
  branch_name = branch_name.replace(/\s+/g, '-').toLowerCase();
  uplodedPath = "/"+school_name+"/"+branch_name+"/learning-library/"
  dirpath = dirpath + uplodedPath
  req.body.uplodedPath = uplodedPath
  //console.log(dirpath)
	if( !fs.existsSync(dirpath) ){
	    fs.mkdirSync(dirpath, { recursive: true })
	}
    cb(null, dirpath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now()+path.extname(file.originalname))
  }
})
let upload = multer({ storage: storage })

helper.upload = upload;
module.exports = helper;