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

    let dirpath = config.videos_path

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