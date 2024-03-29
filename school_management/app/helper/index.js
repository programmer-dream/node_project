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
  var school_name = ''
  let schoolVlsId = req.body.school_id
  if(file.fieldname != 'logo'){
    if(!schoolVlsId) cb("school_id is requeried")
      let school  = await SchoolDetails.findOne({
          where:{school_vls_id:schoolVlsId}
      })
      school_name = school.school_name;
  }else{
    school_name = req.body.school_name;
  }

  school_name = school_name.replace(/\s+/g, '-').toLowerCase();

  uplodedPath = "/"+school_name+"/profile_pic/"

  let logoPath = "/"+school_name+"/"

  if(file.fieldname == 'logo'){
      dirpath = dirpath + logoPath
      req.body.uplodedPath = logoPath
  }else{
      dirpath = dirpath + uplodedPath
      req.body.uplodedPath = uplodedPath

  }

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