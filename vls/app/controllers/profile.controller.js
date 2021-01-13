const { validationResult } = require('express-validator');
const db = require("../models");

const Student = db.Student;
const Guardian = db.Guardian;
const Employee = db.Employee;
const Branch = db.Branch;
const Authentication = db.Authentication;

module.exports = {
  profile,
  listBranch
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



/**
 * API for get list branch for school
 */
async function listBranch(user){

  if(user.role != "school-admin") throw 'Unauthorised user'
  let userData = await Authentication.findOne({ where: { user_name: user.userId } });

  try{

    let wherecondition = { school_vls_id: userData.school_id }
    
    let Branchs  = await Branch.findAll({
                        where:wherecondition,
                        attributes: ['branch_vls_id','branch_name','address']
                      });

    return { success: true, message: "list branch data", data:Branchs }

  }catch(err){
    throw err.message
  }
};