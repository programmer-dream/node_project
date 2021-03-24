const { validationResult } = require('express-validator');
const db = require("../../../models");

const Student = db.Student;
const Guardian = db.Guardian;
const Employee = db.Employee;
const Branch = db.Branch;
const SchoolDetails = db.SchoolDetails;
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
                    where: { student_vls_id: user.userVlsId },
                    include: [{ 
                              model:Branch,
                              as:'branchDetailsStudent',
                              attributes: ['branch_vls_id','branch_name', 'address'],
                              include:[{ 
                                model:SchoolDetails,
                                as:'schoolDetails',
                                attributes: ['school_vls_id','school_name', 'address']
                              }]
                            }]
                    })
  	 userPorfile = student.toJSON();

  }else if(user.role == 'guardian'){

  	let guardian = await Guardian.findOne({ 
                    where: { parent_vls_id: user.userVlsId },
                    include: [{ 
                              model:Branch,
                              as:'branchDetailsGuardian',
                              attributes: ['branch_vls_id','branch_name', 'address'],
                              include:[{ 
                                model:SchoolDetails,
                                as:'schoolDetails',
                                attributes: ['school_vls_id','school_name', 'address']
                              }]
                            }]
                    })
  	userPorfile = guardian.toJSON();

  }else{

  	let employee = await Employee.findOne({ 
                    where: { faculty_vls_id: user.userVlsId },
                    include: [{ 
                              model:Branch,
                              as:'branchDetails',
                              attributes: ['branch_vls_id','branch_name', 'address'],
                              include:[{ 
                                model:SchoolDetails,
                                as:'schoolDetails',
                                attributes: ['school_vls_id','school_name', 'address']
                              }]
                            }]
                    })
  	userPorfile = employee.toJSON();

  }

  let userDetails = await Authentication.findOne({ 
                      attributes: [ 'rewards_points' ],
                      where: { user_name: user.userId },
                    })
  userPorfile.rewards_points = userDetails.rewards_points

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