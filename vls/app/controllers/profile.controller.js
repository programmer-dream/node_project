const { validationResult } = require('express-validator');
const db = require("../models");

const Student = db.Student;
const Guardian = db.Guardian;
const Employee = db.Employee;

module.exports = {
  profile
};

async function profile(user){
  let userPorfile
  if(!user) throw 'user not found'

  if(user.role == 'student'){

  	let student = await Student.findOne({ 
                    attributes: ['name', 'phone', 'email', 'present_address', 'photo'],
                    where: { student_vls_id: user.userVlsId }
                    })
  	 userPorfile = student.toJSON();

  }else if(user.role == 'guardian'){

  	let guardian = await Guardian.findOne({ 
                    attributes: ['name', 'phone', 'email', 'present_address', 'photo'],
                    where: { parent_vls_id: user.userVlsId }
                    })
  	userPorfile = guardian.toJSON();

  }else{

  	let employee = await Employee.findOne({ 
                    attributes: ['name', 'phone', 'email', 'present_address', 'photo'],
                    where: { faculty_vls_id: user.userVlsId }
                    })
  	userPorfile = employee.toJSON();

  }

  return { success: true, message: "profie data", data : userPorfile};
};