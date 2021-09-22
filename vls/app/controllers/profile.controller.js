const { validationResult } = require('express-validator');
const db = require("../../../models");

const Student           = db.Student;
const Guardian          = db.Guardian;
const Employee          = db.Employee;
const Branch            = db.Branch;
const SchoolDetails     = db.SchoolDetails;
const Authentication    = db.Authentication;
const VlsRewards        = db.VlsRewards;
const Section           = db.Section;
const Classes           = db.Classes;
const Role              = db.Role;
const Subject           = db.Subject;
const RecaptchaSettings = db.RecaptchaSettings;

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
                                attributes: ['school_vls_id','school_name', 'address','school_code','logo']
                              }]
                            },{ 
                              model:Section,
                              as:'section',
                              attributes: ['name']
                            },{ 
                              model:Classes,
                              as:'classes',
                              attributes: ['name']
                            },{ 
                              model:SchoolDetails,
                              as:'school',
                              attributes: ['school_vls_id','school_name', 'address','school_code','logo']
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
                                attributes: ['school_vls_id','school_name', 'address','school_code','logo']
                              }]
                            },{ 
                              model:SchoolDetails,
                              as:'school',
                              attributes: ['school_vls_id','school_name', 'address','school_code','logo']
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
                                attributes: ['school_vls_id','school_name', 'address','school_code','logo']
                              }]
                            },{ 
                              model:SchoolDetails,
                              as:'school',
                              attributes: ['school_vls_id','school_name', 'address','school_code','logo']
                            }]
                    })
  	userPorfile = employee.toJSON();

  }
  let minPoint = await VlsRewards.findOne({
      attributes:['min_point_redeemed']
     })
  let userDetails = await Authentication.findOne({ 
                      attributes: [ 'rewards_points', 'rewards_request', 'point_redeemed' ],
                      where: { user_name: user.userId },
                    })
  userPorfile.rewards_points = userDetails.rewards_points
  userPorfile.rewards_request = userDetails.rewards_request
  userPorfile.point_redeemed = userDetails.point_redeemed
  userPorfile.min_point_redeemed = 0
  if(minPoint)
      userPorfile.min_point_redeemed = minPoint.min_point_redeemed
  
  if(user.role == 'teacher')
    userPorfile.classes = await getTeacherClassesSubjects(user.userVlsId)


  if(user.role == 'super-admin'){
    userPorfile.captchaSetting = {"site_key": "", "is_enabled": 0}
    let captchaSetting = await RecaptchaSettings.findOne()
    if(captchaSetting){
      userPorfile.captchaSetting.is_enabled = captchaSetting.is_enabled
      userPorfile.captchaSetting.site_key   = captchaSetting.site_key
    }
  }

  return { success: true, message: "profie data", data : userPorfile};
};


/**
 * Function to get teacher classes subjects
 */
async function getTeacherClassesSubjects(userID){
  let teachers = await Authentication.findOne({
                  attributes: {
                    exclude: ['password','old_passwords','forget_pwd_token']
                  },
                  include:[{ 
                            model:Role,
                            as:'roles',
                            where : {slug : 'teacher'},
                            attributes:['slug','name']
                      },{ 
                          model:Employee,
                          as:'employee',
                          where : {faculty_vls_id: userID},
                          include: [{ 
                            model:Classes,
                            as:'teacher_class'
                          },{ 
                            model:Subject,
                            as:'teacher_subject'
                          }]
                      }]
              })

  teachers            =  teachers.toJSON()
  let classArr        =  teachers.employee.teacher_class
  let teacher_subject =  teachers.employee.teacher_subject
  let class_subject   =  {}

  await Promise.all(
      teacher_subject.map(async (subject , index) => {
          if(!class_subject[subject.class_id])
              class_subject[subject.class_id] = []

          class_subject[subject.class_id].push(subject)
      })
  )
  //return class_subject
  await Promise.all(
    classArr.map(async (classData , index) => {
        
        if(class_subject[classData.class_vls_id]){
          classData.subject = class_subject[classData.class_vls_id]
        }else{
          classData.subject = []
        }
    })
  )
  console.log(classArr, "classArrclassArrclassArr")
  return classArr

}


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