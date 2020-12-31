let helper = {};
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const config = require("../../../config/env.js");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	let dirpath = config.img_path
	if( !fs.existsSync(dirpath) ){
	    fs.mkdirSync(dirpath, { recursive: true })
	}
    cb(null, config.img_path)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now()+path.extname(file.originalname))
  }
})
let upload = multer({ storage: storage })

helper.upload = upload;
module.exports = helper;