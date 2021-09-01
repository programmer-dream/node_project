const { validationResult } = require('express-validator');
const db 	 	     = require("../../../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const Employee   = db.Employee;
const sequelize  = db.sequelize;
const SchoolDetails= db.SchoolDetails;
const Branch  		 = db.Branch;
const Role         = db.Role;
const Student      = db.Student;
const Guardian     = db.Guardian;
const Section      = db.Section;
const Classes      = db.Classes;
const Subject      = db.Subject;
const Assignment   = db.Assignment;
const StudentQuery = db.StudentQuery;
const Feedback     = db.Feedback;
const Ticket       = db.Ticket;
const LearningLibrary = db.LearningLibrary;
const VideoLearningLibrary = db.VideoLearningLibrary;
const CommunityChat = db.CommunityChat;
const Chat          = db.Chat;
const Marks         = db.Marks;
const StudentAttendance  = db.StudentAttendance;
const AcademicYear  = db.AcademicYear;
const Exams         = db.Exams;
const Notification  = db.Notification;
const SchoolMeetingSettings  = db.SchoolMeetingSettings;
const VlsVideoServices  = db.VlsVideoServices;
const VlsMeetingServices  = db.VlsMeetingServices;
const ServiceProvider  = db.ServiceProvider;
const VlsMeetings       = db.VlsMeetings;


module.exports = {
  create,
  view,
  list,
  AllList,
  update,
  deleteSchool,
  schoolSettingUpdate,
  createBranch,
  viewBranch,
  listBranch,
  updateBranch,
  deleteBranch,
  updateBranchSettings,
  createUser,
  updateUser,
  deleteUser,
  viewUser,
  listStudents,
  listTeachers,
  listParents,
  viewStudent,
  viewTeacher,
  viewParent,
  dasboardCount,
  allBranches,
  AllAppUsage,
  createSchoolMeetingSettings,
  listSchoolMeetingSettings,
  viewSchoolMeetingSettings,
  updateSchoolMeetingSettings,
  deleteSchoolMeetingSettings,
  createVlsVideoServices,
  listVlsVideoServices,
  viewVlsVideoServices,
  updateVlsVideoServices,
  deleteVlsVideoServices,
  vlsVideoServicesDropdown,
  providerDropdown
};


/**
 * API for create a school
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let data   = req.body

  if(req.files.logo && req.files.logo.length > 0){
        data.logo  = req.body.uplodedPath + req.files.logo[0].filename;
  }
  let school = await SchoolDetails.create(data)
  //updated school data
  school.update({'school_vls_id':school.school_id})
  return { success: true, message: "School created successfully", data : school}
};


/**
 * API for view school
 */
async function view(id){
  let school = await SchoolDetails.findByPk(id)
  if(!school) throw 'School not found'

  let role = await Role.findOne({
      where : { slug :'school-admin' },
      attributes: ['id']
    })

  let users = await User.findAll({
    where : { 
      role_id : role.id,
      school_id : school.school_id  
    },
    attributes: {
      exclude: ['password','old_passwords','forget_pwd_token']
    },
    include: [{ 
                model:Employee,
                as:'employee'
              }]
  })
  return { success: true, message: "School view", data : {school , users}}
};

/**
 * API for view school
 */
async function list(params , user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';
  let search = ''

  if(params.search) 
    search = params.search

  if(params.orderBy == 'asc') 
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  let whereCondition = {
      [Op.or]:{
              school_name: { 
                  [Op.like]: `%`+search+`%`
                }
           }
    };
  if(params.school_id) 
     whereCondition.school_id = params.school_id

  let schools = await SchoolDetails.findAll({
    limit : limit,
    offset: offset,
    where : whereCondition,
    order : [
             ['school_id', orderBy]
            ]
  })

  let allSchool = []
  await Promise.all(
    schools.map(async school => {
      school = school.toJSON()
        if(!school['allCounts'])
            school['allCounts'] = await getUserCount(school.school_id)

        allSchool.push(school)
    })
  )

  //await getUserCount();
  return { success: true, message: "School list", data : allSchool}
};


/**
 * API for update a school
 */
async function update(req, id){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let school = await SchoolDetails.findByPk(id)
  if(!school) throw 'school not found'

  let data   = req.body
  await school.update(data)
  
  return { success: true, message: "School updated successfully", data : school}
};


/**
 * API for delete school
 */
async function deleteSchool(id){
  let school = await SchoolDetails.findByPk(id)
  if(!school) throw 'school not found'

  await school.update({is_deleted : 1})
  	
  return { success: true, message: "School deleted successfully" }
};


/**
 * API for update school settings
 */
async function schoolSettingUpdate(id, body){
  let school = await SchoolDetails.findByPk(id)
  if(!school) throw 'school not found'

  await school.update(body)
  
  return { success: true, message: "School settings updated successfully", data : school}
};


/**
 * API for create a Branch
 */
async function createBranch(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let data                = req.body
  let branch = await Branch.create(data)
  //updated branch data
  branch.update({'school_vls_id':branch.school_id})
  return { success: true, message: "Branch created successfully", data : branch}
};


/**
 * API for view branch
 */
async function viewBranch(id){
  let branch = await Branch.findOne({
    where : {branch_vls_id : id},
    include: [{ 
                model:SchoolDetails,
                as:'schoolDetails'
              }]
  })
  if(!branch) throw 'branch not found'

  let role = await Role.findOne({
      where : { slug :'branch-admin' },
      attributes: ['id']
    })

  let pRole = await Role.findOne({
      where : { slug :'principal' },
      attributes: ['id']
  })

  let users = await User.findAll({
    where : { 
      role_id       : role.id,
      branch_vls_id :  id 
    },
    attributes: {
      exclude: ['password','old_passwords','forget_pwd_token']
    },
    include: [{ 
                model:Employee,
                as:'employee'
              }]
  })

  let principal = await User.findOne({
    where : { 
      role_id       : pRole.id,
      branch_vls_id :  id 
    },
    attributes: {
      exclude: ['password','old_passwords','forget_pwd_token']
    },
    include: [{ 
                model:Employee,
                as:'employee'
              }]
  })
  allCounts = await getbranchUser(id)
  let studentCounts = await getBranchStudents(id)

  if(branch.vendor_details || branch.vendor_details != "")
    branch.vendor_details= JSON.parse(branch.vendor_details)
  return { success: true, message: "Branch view", data : {branch, users,principal ,allCounts, studentCounts }}
};


/**
 * API for view school
 */ 
async function listBranch(id , user, params){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';
  let search  = ''

  if(params.search) 
    search = params.search

  if(params.orderBy == 'asc') 
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)
   
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  let whereCondition = {
      [Op.or]:{
              branch_name: { 
                  [Op.like]: `%`+search+`%`
                }
           },
      school_id : id
    };

  let branches = await Branch.findAll({
  	  limit : limit,
      offset: offset,
      where : whereCondition,
      order : [
               ['branch_vls_id', orderBy]
              ]
  })

  allBranches = []
  await Promise.all(
    branches.map(async branch => {
        branch = branch.toJSON()
        branch['userCounts']= await getbranchUser( branch.branch_vls_id )
        allBranches.push(branch)
    })
  )

  return { success: true, message: "Branch list", data : allBranches}
};


/**
 * API for update a school
 */
async function updateBranch(req, id){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let branch = await Branch.findByPk(id)
  if(!branch) throw 'Branch not found'

  let data   = req.body
  await branch.update(data)
  
  return { success: true, message: "Branch updated successfully", data : branch}
};


/**
 * API for delete school
 */
async function deleteBranch(id){
  let branch = await Branch.findByPk(id)
  if(!branch) throw 'Branch not found'

  await branch.update({is_deleted : 1})
  	
  return { success: true, message: "Branch deleted successfully" }
};


/**
 * API for update branch settings
 */
async function updateBranchSettings(id, body){
  let branch = await Branch.findByPk(id)
  if(!branch) throw 'Branch not found'

  await branch.update(body)
  
  return { success: true, message: "Branch settings updated successfully", data : branch}
};


/**
 * API for create a user
 */
async function createUser(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let data          = req.body
  if(req.files.photo && req.files.photo.length > 0){
        data.photo  = req.body.uplodedPath + req.files.photo[0].filename;
  }
  let school_id     = data.school_id
  let branch_vls_id = data.branch_vls_id
  let role          = {}
  let password      = bcrypt.hashSync(data.password, 8);

  if(data.type == 'branch'){
     role = await Role.findOne({
      where : { slug :'branch-admin' },
      attributes: ['id']
    })
  }else{
     role  = await Role.findOne({
      where : { slug :'school-admin' },
      attributes: ['id']
    })
    delete data.branch_vls_id
  }

  let role_id = role.id
  data.school_vls_id = school_id
  delete data.type
  delete data.password
  delete data.school_id
  let employee  = await Employee.create(data)
  let userData  = {
                    user_name         : Date.now(),
                    user_vls_id       : employee.faculty_vls_id,
                    school_id         : school_id,
                    branch_vls_id     : branch_vls_id,
                    role_id           : role_id,
                    password          : password,
                    recovery_email_id : data.email,
                    old_passwords     : JSON.stringify([password]),
                    name              : data.name,
                    photo             : data.photo
                  }

  let authUser  = await User.create(userData)
  authUser = await User.findOne({
    where : { auth_vls_id : authUser.auth_vls_id },
    include: [{ 
                model:Employee,
                as:'employee'
              }]
  })
  return { success: true, message: "user created successfully", data : authUser}
};


/**
 * API for update a user
 */
async function updateUser(id, req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let authUser  = await User.findByPk(id)
  if(!authUser) throw 'user not found'

  let data          = req.body
  if(req.files.photo && req.files.photo.length > 0){
        data.photo  = req.body.uplodedPath + req.files.photo[0].filename;
  }
  let school_id     = data.school_id
  let branch_vls_id = data.branch_vls_id
  
  let userData  = {
                    school_id     : school_id,
                    branch_vls_id : branch_vls_id,
                    name          : data.name,
                    photo         : data.photo,
                    recovery_email_id   : data.email
                  }

  authUser.update(userData)
  data.school_vls_id = school_id
  let employee  = await Employee.update(data,{
    where : {faculty_vls_id : authUser.user_vls_id}
  })

  let authUpdatedUser = await User.findOne({
    where : { auth_vls_id : authUser.auth_vls_id },
    attributes: {
      exclude: ['password','old_passwords','forget_pwd_token']
    },
    include: [{ 
                model:Employee,
                as:'employee'
              }]
  })
  return { success: true, message: "user created successfully", data : authUpdatedUser}
};



/**
 * API for delete a user
 */
async function deleteUser(id){
  let user = await User.findByPk(id)
  if(!user) throw 'user not found'

  await Employee.update({ is_deleted : 1},{
    where : {faculty_vls_id : user.user_vls_id}
  })

  await user.update({ is_deleted : 1})
    
  return { success: true, message: "User deleted successfully" }
}



/**
 * API for view school
 */
async function viewUser(id){

  authUser = await User.findOne({
    where : { auth_vls_id : id },
    attributes: {
      exclude: ['password','old_passwords','forget_pwd_token']
    },
    include: [{ 
                model:Employee,
                as:'employee'
              },{ 
                model:SchoolDetails,
                as:'school',
                attributes:['school_id','school_name']
              }]
  })
  if(!authUser) throw 'User not found'
    
  return { success: true, message: "View user", data:authUser }
}



/**
 * API get users count 
 */
async function getUserCount(school_id){
  let branchCount = await Branch.count({ where: {school_vls_id : school_id} })
  let roles = await Role.findAll({
    where : { 
              slug : 
              { [Op.in] : ['student','teacher','guardian','branch-admin','school-admin','principal']
              } 
        },
        attributes:['slug']
  }).then(roles => roles.map(role => role.slug));

  let data = await sequelize.query("SELECT COUNT(`roles`.`id`) AS `count`, `roles`.`slug` AS `slug`, roles.name FROM `users` AS `users` left OUTER JOIN `roles` AS `roles` ON `users`.`role_id` = `roles`.`id` WHERE `users`.`school_id` = "+school_id+"  AND roles.slug IN('student','teacher','guardian','branch-admin','school-admin','principal') GROUP BY `slug`, name ;", { type: Sequelize.QueryTypes.SELECT });

  let allCounts = {}
  await Promise.all(
    data.map(async user => {
        if(!allCounts[user.slug])
            allCounts[user.slug] = user.count
    })
  )

  await Promise.all(
    roles.map(async role => {
        if(!allCounts[role])
            allCounts[role] = 0
    })
  )
  

  allCounts['branches count'] = branchCount
  return allCounts
}



/**
 * API get branch user count 
 */
async function getbranchUser(branch_vls_id){
  let roles = await Role.findAll({
    where : { 
              slug : 
              { [Op.in] : ['student','teacher','guardian','principal']
              } 
        },
        attributes:['slug']
  }).then(roles => roles.map(role => role.slug));

  let data = await sequelize.query("SELECT COUNT(`roles`.`id`) AS `count`, `roles`.`slug` AS `slug`, roles.name FROM `users` AS `users` right OUTER JOIN `roles` AS `roles` ON `users`.`role_id` = `roles`.`id` WHERE `users`.`branch_vls_id` = "+branch_vls_id+"  AND roles.slug IN('student','teacher','guardian','principal') GROUP BY `slug`, name ;", { type: Sequelize.QueryTypes.SELECT });
  
  let allCounts = {}
  await Promise.all(
    data.map(async user => {
        if(!allCounts[user.slug])
            allCounts[user.slug] = user.count
    })
  )

  await Promise.all(
    roles.map(async role => {
        if(!allCounts[role])
            allCounts[role] = 0
    })
  )
  let class_count = await Classes.count({
    where : {branch_vls_id : branch_vls_id }
  })
  let section_count = await Section.count({
    where : {branch_vls_id : branch_vls_id }
  })
  allCounts.class_count   = class_count
  allCounts.section_count = section_count
  return allCounts
}


/**
 * API get list students
 */
async function listStudents(params, user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';
  let search  = ''

  if(params.search) 
    search = params.search

  if(params.orderBy == 'asc') 
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)
   
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  let parentWhere = {
    [Op.or]:{
              name: { 
                [Op.like]: `%`+search+`%`
              }
            }
  }
  //condition for parent 
  let parents = await Guardian.findAll({
      where : parentWhere,
      attributes : ['parent_vls_id']
  }).then(parents => parents.map(parents => parents.parent_vls_id));

  let whereCondition = {
    [Op.or]:[{
            name: { 
                [Op.like]: `%`+search+`%`
              }
         },{
            parent_vls_id: { 
                [Op.in]: parents
              }
         }]
  };

  if(params.class_id) 
     whereCondition.class_id = params.class_id

  if(params.section_id) 
     whereCondition.section_id = params.section_id

  if(params.student_vls_id) 
     whereCondition.student_vls_id = params.student_vls_id

  let students = await Student.findAll({
      limit : limit,
      offset: offset,
      where : whereCondition,
      order : [
               ['student_vls_id', orderBy]
              ], 
      include: [{ 
                  model:Section,
                  as:'section',
                },{ 
                  model:Classes,
                  as:'classes',
                  include: [{ 
                    model:Employee,
                    as:'class_teacher'
                  }]
               },{ 
                  model:Guardian,
                  as:'parent',
               }]
  })

  return { success: true, message: "list students", data:students }
}


/**
 * API get list teachers
 */
async function listTeachers(params, user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';
  let search  = ''

  if(params.search) 
    search = params.search

  if(params.orderBy == 'asc') 
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)
   
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  let whereCondition = {
      [Op.or]:{
              name: { 
                  [Op.like]: `%`+search+`%`
                }
           },
    };

  if(params.faculty_vls_id) 
     whereCondition.faculty_vls_id = params.faculty_vls_id

  let userCondition = {}
  if(params.branch_vls_id) 
     userCondition.branch_vls_id = params.branch_vls_id

  if(params.school_vls_id) 
     userCondition.school_id = params.school_vls_id

  let subjectFilter = {}
  if(params.subject_code) 
     subjectFilter.code = params.subject_code

  let classFilter = {}
  if(params.class_vls_id) 
     classFilter.class_vls_id = params.class_vls_id

  let sectionFilter = {}
  if(params.section_id) 
     sectionFilter.id = params.section_id

  let teachers = await User.findAll({
                    limit : limit,
                    offset: offset,
                    where : userCondition,
                    order : [
                             ['user_vls_id', orderBy]
                            ],
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
                              where:whereCondition,
                              include: [{ 
                                model:Classes,
                                as:'teacher_class',
                                where:classFilter
                              },{ 
                                model:Section,
                                as:'teacher_section',
                                where:sectionFilter
                              },{ 
                                model:Subject,
                                as:'teacher_subject',
                                where : subjectFilter
                              }]
                          }]
                    })

  return { success: true, message: "list teachers", data:teachers }
}



/**
 * API get list parents
 */
async function listParents(params, user){
  let limit   = 10
  let offset  = 0
  let orderBy = 'desc';
  let search  = ''

  if(params.search) 
    search = params.search

  if(params.orderBy == 'asc') 
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)
   
  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  let whereCondition = {
      [Op.or]:{
              name: { 
                  [Op.like]: `%`+search+`%`
                }
           },
    };

  if(params.class_id) 
     whereCondition.class_id = params.class_id

  if(params.section_id) 
     whereCondition.section_id = params.section_id

  if(params.parent_vls_id) 
     whereCondition.parent_vls_id = params.parent_vls_id

  if(params.branch_vls_id) 
     whereCondition.branch_vls_id = params.branch_vls_id

  if(params.school_vls_id) 
     whereCondition.school_vls_id = params.school_vls_id

  let guardian = await Guardian.findAll({
      limit : limit,
      offset: offset,
      where : whereCondition,
      order : [
               ['parent_vls_id', orderBy]
              ],
      include:[{ 
                model:Student,
                as:'children',
                  include:[{ 
                      model:Section,
                      as:'section',
                      },{ 
                        model:Classes,
                        as:'classes'
                    }]
              }] 
  })
  
  return { success: true, message: "list parents", data:guardian }
}


/**
 * API get view student
 */
async function viewStudent(id, user){
  let student = await Student.findOne({
      where : {student_vls_id: id},
      include: [{ 
                  model:Section,
                  as:'section',
                },{ 
                  model:Classes,
                  as:'classes',
                  include: [{ 
                    model:Employee,
                    as:'class_teacher'
                  }]
               },{ 
                  model:Guardian,
                  as:'parent',
               }] 
  })

  return { success: true, message: "view student", data:student }
}


/**
 * API get view teacher
 */
async function viewTeacher(id, user){
  let teachers = await User.findOne({
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
                              where : {faculty_vls_id: id},
                              include: [{ 
                                model:Classes,
                                as:'teacher_class'
                              },{ 
                                model:Section,
                                as:'teacher_section'
                              },{ 
                                model:Subject,
                                as:'teacher_subject'
                              }]
                          }]
                  })
  teachers = teachers.toJSON()
  let classArr   =  teachers.employee.teacher_class
  let sectionArr =  teachers.employee.teacher_section

  await Promise.all(
    classArr.map(async (classData , index) => {
        sectionArr.map(async section => {

          if(classData.class_vls_id == section.class_id){
            if(!classArr[index]['sections'])
               classArr[index]['sections'] = []
            classArr[index]['sections'].push(section)
          }
        })
    })
  )

  delete teachers.employee.teacher_section
  teachers.employee.teacher_class = classArr

  let  answered_queries_count = await StudentQuery.count({
    where : { 
              faculty_vls_id : id,
              response_date : { [Op.ne]: null }
            }
  })
  let  feedback_raised_count = await Feedback.count({
    where : { 
              related_to : id,
              related_type : 'teacher'
            }
  })
  let rasied = await Ticket.count({
      where : { 
                assigned_user_id : id,
                assigned_user_type : 'employee'
              }
    })
  let closed = await Ticket.count({
      where : { 
                assigned_user_id : id,
                assigned_user_type : 'employee',
                resolved_date : { [Op.ne]: null }
              }
    })

  let tickets    = {rasied , closed }
  let created    = await Assignment.count({
                        where : { 
                                added_by : id,
                                user_role : 'teacher'
                              }
                    })

  let currentDate = moment().format('YYYY-MM-DD')
  let inprogress = await Assignment.count({
                        where : { 
                                added_by : id,
                                is_released : 1,
                                [Op.eq]: sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '>=', currentDate)
                              }
                    })

  let aclosed    = await Assignment.count({
                          where : { 
                                added_by : id,
                                user_role : 'teacher',
                                [Op.eq]: sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '<', currentDate)
                              }
                    })
  let assignment = {created , inprogress, closed :aclosed}

  teachers.counts = { answered_queries_count, feedback_raised_count,tickets,assignment }
  return { success: true, message: "view teacher", data:teachers }
}


/**
 * API get view parent
 */
async function viewParent(id, user){
  let guardian = await Guardian.findOne({
      where : {parent_vls_id: id},
      include:[{ 
                model:Student,
                as:'children',
                  include:[{ 
                      model:Section,
                      as:'section',
                      },{ 
                        model:Classes,
                        as:'classes'
                    }]
              }]
  })
  
  return { success: true, message: "view parent", data:guardian }
}


/**
 * API get dashboard count
 */
async function dasboardCount(query, user, activeUserArr){
  let school_vls_id  = query.school_vls_id 
  let branch_vls_id  = query.branch_vls_id 
  let total_branches = 0
  let student_count  = 0
  let teachers_count = 0
  let assignment     = 0
  let feedback       = 0
  let ticket         = 0
  let online_class   = 0

  let userCount      = 0
  let finalData      = {}

  switch (user.role) {
    case 'super-admin':
          let total_schools  = await SchoolDetails.count();
          total_branches     = await Branch.count();
          total_users        = await User.count();
          student_count      = await Student.count();
          teachers_count     = await User.count({
                                      include:[{ 
                                                model:Role,
                                                as:'roles',
                                                where : {slug : 'teacher'},
                                              }]
                                      })
          assignment = await getAssignmentCount()
          query      = await getQueryCount()
          feedback   = await getFeedbackCount()
          ticket     = await getTicketCount()
          eBook      = await getEbookCount()
          eVideos    = await getVideosCount()
          community  = await getCommunityCount()
          chat       = await getChatCount()
          chat.active_user = activeUserArr.length
          online_class = await getMeetingCounts({})
          finalData  = { total_schools, total_branches, total_users , student_count, teachers_count , assignment, query, feedback, ticket, eBook, eVideos, community, chat, online_class}
      break;
    case 'branch-admin':
    case 'principal':

          if(!branch_vls_id) 
             throw 'branch_vls_id is required'

          if(!school_vls_id) 
             throw 'school_vls_id is required'

          total_users    = await User.count({
            where : {branch_vls_id : branch_vls_id}
          });
          student_count     = await Student.count({
            where : { branch_vls_id : branch_vls_id}
          });
          teachers_count     = await User.count({
                                    where : {branch_vls_id : branch_vls_id},
                                    include:[{ 
                                              model:Role,
                                              as:'roles',
                                              where : {slug : 'teacher'}
                                            }]
                                    })
          assignment  = await getAssignmentCount(null , branch_vls_id)
          query       = await getQueryCount(null , branch_vls_id)
          feedback    = await getFeedbackCount(null , branch_vls_id)
          ticket      = await getTicketCount(null , branch_vls_id)
          chat       = await getChatCount(null , branch_vls_id)
          community  = await getCommunityCount(null , branch_vls_id)
          eBook      = await getEbookCount(null , branch_vls_id)
          attendance = await getAttendance(null , branch_vls_id)
          performance_avg = await getSchoolPerformance(school_vls_id, branch_vls_id)
          top_performance  = await getTopPerformer(school_vls_id, branch_vls_id)
          online_class = await getMeetingCounts({branch_vls_id:branch_vls_id })
          finalData = { total_users , student_count, teachers_count, assignment, query, feedback, ticket, chat, community, eBook, attendance, performance_avg, top_performance,online_class}
      break;
    case 'school-admin':
        
          if(!school_vls_id) 
            throw 'school_vls_id is required'

          let where = { school_id : school_vls_id}
          let schoolWhere = { school_vls_id : school_vls_id}

          if(branch_vls_id){
              where.branch_vls_id = branch_vls_id
              schoolWhere.branch_vls_id = branch_vls_id
          }

          total_branches = await Branch.count({
            where : schoolWhere
          });
          total_users     = await User.count({
            where : where
          });
          student_count     = await Student.count({
            where : where
          });
          teachers_count     = await User.count({
                                    where : where,
                                    include:[{ 
                                              model:Role,
                                              as:'roles',
                                              where : {slug : 'teacher'}
                                            }]
                                    })
          assignment = await getAssignmentCount(school_vls_id,branch_vls_id)
          query      = await getQueryCount(school_vls_id,branch_vls_id)
          feedback   = await getFeedbackCount(school_vls_id,branch_vls_id)
          ticket     = await getTicketCount(school_vls_id,branch_vls_id)
          chat       = await getChatCount(school_vls_id,branch_vls_id)
          community  = await getCommunityCount(school_vls_id,branch_vls_id)
          eBook      = await getEbookCount(school_vls_id,branch_vls_id)
          chat.active_user = activeUserArr.length
          top_performance  = await getTopPerformer(school_vls_id,branch_vls_id)
          attendance = await getAttendance(school_vls_id,branch_vls_id)
          performance_avg = await getSchoolPerformance(school_vls_id,branch_vls_id)
          online_class = await getMeetingCounts({school_vls_id:school_vls_id})
          finalData  = { total_branches, total_users , student_count, teachers_count, assignment, query, feedback, ticket, chat, community, eBook, top_performance, attendance, performance_avg,online_class}
      break;
  }
  
  return { success: true, message: "Dasboard count", data:finalData }
}



/**
 * API get assignment count
 */
async function getAssignmentCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = { assignment_type : 'online' , is_released : 1}
    let currentDate = moment().format('YYYY-MM-DD')

    let whereActive = { 
      is_released : 1,
      [Op.eq]: sequelize.where(sequelize.fn('date', sequelize.col('assignment_completion_date')), '>=', currentDate)
    }
    if(school_vls_id){
       whereCondition.school_vls_id = school_vls_id
       whereActive.school_vls_id = school_vls_id
    }

    if(branch_vls_id){
       whereCondition.branch_vls_id = branch_vls_id
       whereActive.branch_vls_id = branch_vls_id
    }

    let online  = await Assignment.count({
                        where : whereCondition
                      })

    whereCondition.assignment_type = 'offline'
    let offline  = await Assignment.count({
                        where : whereCondition
                      })

    let active  = await Assignment.count({
                        where : whereActive
                      })

    return { online, offline, active}
}

/**
 * API get query count
 */
async function getQueryCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = { query_status : 'open' }

    if(school_vls_id)
       whereCondition.school_vls_id = school_vls_id

    if(branch_vls_id)
       whereCondition.branch_vls_id = branch_vls_id

    let open  = await StudentQuery.count({
                        where : whereCondition
                      })

    whereCondition.query_status = 'Closed'
    let closed  = await StudentQuery.count({
                        where : whereCondition
                      })
    return { open , closed }
}

/**
 * API get feedback count
 */
async function getFeedbackCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = { status : 'open' }

    if(school_vls_id)
       whereCondition.school_vls_id = school_vls_id

    if(branch_vls_id)
       whereCondition.branch_vls_id = branch_vls_id

    let open  = await Feedback.count({
                        where : whereCondition
                      })

    whereCondition.status = 'closed'
    let closed  = await Feedback.count({
                        where : whereCondition
                      })
    return { open , closed }
}

/**
 * API get query count
 */
async function getTicketCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = { status : { [Op.in] : ['new','assigned','wip'] } }

    if(school_vls_id)
       whereCondition.school_vls_id = school_vls_id

    if(branch_vls_id)
       whereCondition.branch_vls_id = branch_vls_id

    let open  = await Ticket.count({
                        where : whereCondition
                      })

    whereCondition.status = 'resolved'
    let resolved  = await Ticket.count({
                        where : whereCondition
                      })
    return { open , resolved }
}

/**
 * API get learning library
 */
async function getEbookCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = {}

    if(school_vls_id)
       whereCondition.school_vls_id = school_vls_id

    if(branch_vls_id)
       whereCondition.branch_vls_id = branch_vls_id

    let eBook  = await LearningLibrary.count({
                        where : whereCondition
                      })
    return  eBook 
}

/**
 * API get video library
 */
async function getVideosCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = {}

    if(school_vls_id)
       whereCondition.school_vls_id = school_vls_id

    if(branch_vls_id)
       whereCondition.branch_vls_id = branch_vls_id

    let eVideos  = await VideoLearningLibrary.count({
                        where : whereCondition
                      })

    return  { eVideos}
}


/**
 * API get community library
 */
async function getCommunityCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = {}

    if(school_vls_id)
       whereCondition.school_vls_id = school_vls_id

    if(branch_vls_id)
       whereCondition.branch_vls_id = branch_vls_id

    let total_count  = await CommunityChat.count({
                        where : whereCondition
                      })
    whereCondition.community_status = 'Active'
    let active  = await CommunityChat.count({
                        where : whereCondition
                      })

    return  { total_count ,  active }
}


/**
 * API get chat library
 */
async function getChatCount(school_vls_id = null, branch_vls_id = null){
    let whereCondition = {}

    if(school_vls_id)
       whereCondition.school_vls_id = school_vls_id

    if(branch_vls_id)
       whereCondition.branch_vls_id = branch_vls_id

    let total_count  = await Chat.findAll({
                         where : whereCondition,
                         attributes :['sender_user_vls_id','sender_type','receiver_user_vls_id','receiver_type'],
                         group : ['sender_user_vls_id',
                                  'sender_type',
                                  'receiver_user_vls_id',
                                  'receiver_type',
                                  ]
                        });

    total_count = total_count.length
    return  { total_count }
}


/**
 * API for top Three Perfromer data 
 */
async function getTopPerformer(school_vls_id, branch_vls_id = null){
  let whereCondition = {}

  if(school_vls_id)
      whereCondition.school_id = school_vls_id

  //acadminc year
  let academicYear  = await AcademicYear.findOne({
                        where:{ school_id : school_vls_id },
                        order : [
                         ['id', 'desc']
                        ]
                      })
  let examWhere = { 
                    school_id : school_vls_id ,
                    academic_year_id : academicYear.id
                  }

  if(branch_vls_id){
      examWhere.branch_vls_id = branch_vls_id
  }
  //latest exam
  let letestExam = await Exams.findAll({
    where : examWhere,
    attributes : ['test_id']      
  }).then(exams => exams.map(exams => exams.test_id));

  //latest exam condtion
  whereCondition.exam_id = { [Op.in] : letestExam } 

  let allMarks = await Marks.findAll({
    where : whereCondition,
    attributes:[
                    [ Sequelize.fn('SUM', Sequelize.col('exam_total_mark')), 'exam_total_mark' ],
                    [ Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ],
                    'student_id'
                  ],
        include: [{ 
                  model:Student,
                  as:'student',
                  attributes:['name','photo'],
                  include: [{ 
                    model:Branch,
                    as:'branchDetailsStudent',
                    attributes:['branch_name']
                  }]
              }],
    group:['student_id'],
    order : [
                [Sequelize.fn('SUM', Sequelize.col('obtain_total_mark')), 'desc']
              ],
      limit : 3
  })

  return allMarks
}


/**
 * API for top Three Perfromer data 
 */
async function getAttendance(school_vls_id = null, branch_vls_id = null){
    let day   = 'day_'+moment().format('D')
    let month = moment().format('MMMM')
    let year = moment().format('YYYY')

    let whereCondition = {
          year : year,
          month : month
        }
    whereCondition[day] = 'P'

    if(school_vls_id)
      whereCondition.school_id = school_vls_id

    if(branch_vls_id)
      whereCondition.branch_vls_id = branch_vls_id
    
    let present  = await StudentAttendance.count({
        where: whereCondition,
        attributes:[day]
      })

     whereCondition[day] = 'A'

    let absent  = await StudentAttendance.count({
        where: whereCondition,
        attributes:[day]
      })
    return { present, absent}
}


/**
 * API for school Perfromer data 
 */
async function getSchoolPerformance(school_vls_id , branch_vls_id ){
  let whereCondition = {}

  if(school_vls_id)
      whereCondition.school_id = school_vls_id

  //acadminc year
  let academicYear  = await AcademicYear.findOne({
                        where:{ school_id : school_vls_id },
                        order : [
                         ['id', 'desc']
                        ]
                      })
  let examWhere = { 
                    school_id : school_vls_id ,
                    academic_year_id : academicYear.id
                  }

  if(branch_vls_id){
      examWhere.branch_vls_id = branch_vls_id
  }

  //latest exam
  let letestExam = await Exams.findAll({
    where : examWhere,
    attributes : ['test_id']      
  }).then(exams => exams.map(exams => exams.test_id));

  //latest exam condtion
  whereCondition.exam_id = { [Op.in] : letestExam }
  let allMarks = await Marks.findAll({
    where : whereCondition,
    attributes:[
                    [ Sequelize.fn('AVG', Sequelize.col('obtain_total_mark')), 'obtain_total_mark' ]                  
                ],
  })

  return allMarks[0].obtain_total_mark
}

/**
 * API for class & section
 */
async function getBranchStudents(branch_vls_id){
  let classData = await Classes.findAll({
    where : { branch_vls_id : branch_vls_id},
    attributes : ['class_vls_id','name'],
    include: [{ 
                model:Section,
                as:'sections',
                attributes:['name', 'id']
              }]
  })
  // return classData
  let modifedData = []
  let sectionCount = 0
  await Promise.all(
    classData.map(async sClass => {
      let className = sClass.name
      let classID   = sClass.class_vls_id
      let sections  = sClass.sections
      if(sections.length){
          modifedData = await getSectionData(sections, classID, className, modifedData)
        }else{
          studentCount = await Student.count({
                                  where: {class_id : classID}
                                })
          let cObj = {
                class_id : classID,
                class    : sClass.name,
                student_count : studentCount
            }
          modifedData.push(cObj)
        }
    })
  )

  modifedData.sort(function(a,b) {
    return  a.class_id - b.class_id;
  });
  
  return modifedData
}

async function getSectionData(sections, classID, className, modifedData){

  await Promise.all(
    sections.map(async section => {

        studentCount = await Student.count({
                            where:{ class_id : classID, section_id : section.id }
                          })

        let sObj = {
            class_id : classID,
            class    : className,
            section  : section.name,
            student_count : studentCount
        }
       modifedData.push(sObj) 
    })
  );
  return modifedData
}

async function AllList(params , user){
  
  let schools = await SchoolDetails.findAll()
  
  return { success: true, message: "School list", data : schools}
}
async function allBranches(params , user){
  whereCondition = {}
  
  if(params.school_vls_id)
      whereCondition.school_vls_id = params.school_vls_id

  let branches = await Branch.findAll({
    where : whereCondition
  })
  
  allBranches = []
  await Promise.all(
    branches.map(async branch => {
        branch = branch.toJSON()
        branch['userCounts']= await getbranchUser( branch.branch_vls_id )
        allBranches.push(branch)
    })
  )
  return { success: true, message: "Branch list", data : allBranches}
}


/**
 * API for app usage
 */
async function appUsage(query, user){
  let school_vls_id  = query.school_vls_id 
  let branch_vls_id  = query.branch_vls_id 
  let total_branches = 0
  let student_count  = 0
  let teachers_count = 0
  let assignment     = 0
  let feedback       = 0
  let ticket         = 0
  let guardian_count = 0
  let userCount      = 0
  let section_count  = 0
  let clases_count   = 0
  let principal_count= 0
  let branch_admin_count = 0
  let school_admin_count = 0
  let schoolChatEnable = 0
  let notification   = 0
  let finalData      = {}

  switch (user.role) {
    case 'super-admin':
          let total_schools   = await SchoolDetails.count();
          total_branches      = await Branch.count();
          student_count       = await Student.count();
          teachers_count      = await getUserByRole('teacher')
          guardian_count      = await getUserByRole('guardian')
          principal_count     = await getUserByRole('principal')
          branch_admin_count  = await getUserByRole('branch-admin')
          school_admin_count  = await getUserByRole('school-admin')

          assignment          = await getAssignmentCount()
          query               = await getQueryCount()
          feedback            = await getFeedbackCount()
          ticket              = await getTicketCount()
          eBook               = await getEbookCount()
          eVideos             = await getVideosCount()
          community           = await getCommunityCount()
          chat                = await getChatCount()
          notification        = await Notification.count()
          schoolChatEnable  = await SchoolDetails.count({
            where : {chat_support : 'yes'}
          })
          // chat.active_user = activeUserArr.length

          finalData  = { total_schools, total_branches , student_count, teachers_count ,guardian_count, principal_count, branch_admin_count,school_admin_count ,assignment, query, feedback, ticket, eBook, eVideos, community, chat,notification, schoolChatEnable}
      break;
    case 'branch-admin':
    case 'principal':

          if(!branch_vls_id) 
             throw 'branch_vls_id is required'

          if(!school_vls_id) 
             throw 'school_vls_id is required'
          let branchFilter = {}
          branchFilter.branch_vls_id = branch_vls_id

          student_count     = await Student.count({
            where : { branch_vls_id : branch_vls_id}
          });

          teachers_count     = await User.count({
                                    where : {branch_vls_id : branch_vls_id},
                                    include:[{ 
                                              model:Role,
                                              as:'roles',
                                              where : {slug : 'teacher'}
                                            }]
                                    })
          guardian_count      = await getUserByRole('guardian',branchFilter)

          assignment  = await getAssignmentCount(null , branch_vls_id)
          query       = await getQueryCount(null , branch_vls_id)
          feedback    = await getFeedbackCount(null , branch_vls_id)
          ticket      = await getTicketCount(null , branch_vls_id)
          chat       = await getChatCount(null , branch_vls_id)
          community  = await getCommunityCount(null , branch_vls_id)
          eBook      = await getEbookCount(null , branch_vls_id)
          attendance = await getAttendance(null , branch_vls_id)
          performance_avg = await getSchoolPerformance(school_vls_id, branch_vls_id)
          top_performance  = await getTopPerformer(school_vls_id, branch_vls_id)
          clases_count     = await Classes.count({
            where : branchFilter
          });
          section_count     = await Section.count({
            where : branchFilter
          });

          finalData = {student_count, teachers_count, guardian_count, assignment, query, feedback, ticket, chat, community, eBook, attendance, performance_avg, top_performance, clases_count, section_count}
      break;
  }
  return { success: true, message: "App usage count", data:finalData }
}

/**
 * API for app usage
 */
async function getUserByRole(role, where={}){

  let user  = await User.count({
              where : where,
              include:[{ 
                        model:Role,
                        as:'roles',
                        where : {slug : role},
                      }]
              })
  return user
}

/**
 * API for all count list
 */
async function AllAppUsage(query, user){
  if(user.role == 'school-admin'){
    return await branchUsage(query, user)
  }
  let whereCondition = {}
  if(query.school_vls_id)
      whereCondition.school_id = query.school_vls_id

  let schools  = await SchoolDetails.findAll({
    where : whereCondition,
    attributes : ['school_id','school_name']
  })

  let allSchool = {}
  let allData   = await appUsageUpdate({}, user)
  allSchool.all = allData
  
  allSchool.schoolsData = []
  await Promise.all(
    schools.map(async school => {
      let where = {school_vls_id : school.school_id}
      let response = await appUsageUpdate(where, user)
      
      response.school = school
      allSchool.schoolsData.push(response)
    })
  )

  return { success: true, message: "App usage count", data:allSchool }
}


/**
 * API for all count list
 */
async function appUsageUpdate(params, user){
  let where       = {}
  let schoolWhere = {}
  let school_vls_id = null
  let branch_vls_id = null

  let total_schools   = await SchoolDetails.count();
  let schoolChatEnable  = await SchoolDetails.count({
        where : {chat_support : 'yes'}
      })
  let eVideos       = await getVideosCount()
  let notification  = await Notification.count()

  if(params.school_vls_id) {
     where          = { school_id : params.school_vls_id}
     schoolWhere    = { school_vls_id : params.school_vls_id}
     school_vls_id  = params.school_vls_id
     total_schools  = 0
     schoolChatEnable = 0
     eVideos        = 0
  }

  if(params.branch_vls_id){
      where.branch_vls_id       = params.branch_vls_id
      schoolWhere.branch_vls_id = params.branch_vls_id
      branch_vls_id             = params.branch_vls_id
      total_schools  = 0
      schoolChatEnable = 0
      eVideos        = 0
  }


    let total_branches = await Branch.count({
        where : schoolWhere
    });

    let guardian_count      = await getUserByRole('guardian',where)
    let principal_count     = await getUserByRole('principal',where)
    let branch_admin_count  = await getUserByRole('branch-admin',where)
    let school_admin_count  = await getUserByRole('school-admin',where)

    let student_count     = await Student.count({
      where : where
    });
    let clases_count     = await Classes.count({
      where : where
    });
    let section_count     = await Section.count({
      where : where
    });
    let teachers_count     = await User.count({
                          where : where,
                          include:[{ 
                                    model:Role,
                                    as:'roles',
                                    where : {slug : 'teacher'}
                                  }]
                          })
    let assignment = await getAssignmentCount(school_vls_id,branch_vls_id)
    let query      = await getQueryCount(school_vls_id,branch_vls_id)
    let feedback   = await getFeedbackCount(school_vls_id,branch_vls_id)
    let ticket     = await getTicketCount(school_vls_id,branch_vls_id)
    let chat       = await getChatCount(school_vls_id,branch_vls_id)
    let community  = await getCommunityCount(school_vls_id,branch_vls_id)
    let eBook      = await getEbookCount(school_vls_id,branch_vls_id)

    let finalData  = { total_schools, total_branches,  student_count, teachers_count,guardian_count, principal_count, branch_admin_count, school_admin_count, assignment, query, feedback, ticket, chat, community, eBook, eVideos, clases_count,section_count, schoolChatEnable, notification }

    return finalData
}

/**
 * API for all count list
 */
async function branchUsage(query, user){
  let whereCondition = {}
  if(query.branch_vls_id)
      whereCondition.branch_vls_id = query.branch_vls_id

  let branches  = await Branch.findAll({
    where : whereCondition,
    attributes : ['branch_vls_id','branch_name']
  })

  let allBranches = {}
  let allData   = await appUsageUpdate({}, user)
  allBranches.all = allData
  
  allBranches.branchesData = []
  await Promise.all(
    branches.map(async branch => {
      let where = {branch_vls_id : branch.branch_vls_id}
      let response = await appUsageUpdate(where, user)
      
      response.branch = branch
      allBranches.branchesData.push(response)
    })
  )

  return { success: true, message: "App usage count", data:allBranches }
}

/**
 * API for school meeting settings
 */
async function createSchoolMeetingSettings(body, user){
  let schoolMeeting;

  if(!body.meeting_setting_id){
    let schoolSetting = await SchoolMeetingSettings.findOne({
      where : {school_vls_id : body.school_vls_id}
    });
    if(schoolSetting) throw 'school settings already created'

    schoolMeeting= await SchoolMeetingSettings.create(body);

  }else{

    schoolMeeting= await SchoolMeetingSettings.findOne({
      where : {meeting_setting_id : body.meeting_setting_id}
    });

    schoolMeeting.update(body)

  }
  let finalData = schoolMeeting.toJSON()
  finalData.video_service = await VlsVideoServices.findOne({
      where : {video_service_id : body.video_service_id}
  });
  
  return { success: true, message: "school meeting settings", data:finalData}
  
}


/**
 * API for list school meeting settings
 */
async function listSchoolMeetingSettings(query, user){
  let whereCondition = {}

  if(query.branch_vls_id) 
      whereCondition.branch_vls_id = query.branch_vls_id

  if(query.school_vls_id) 
      whereCondition.school_vls_id = query.school_vls_id

  let settings = await SchoolMeetingSettings.findAll({
    where :whereCondition
  });
  
  return { success: true, message: "school meeting settings", data:settings }
  
}


/**
 * API for view school meeting settings
 */
async function viewSchoolMeetingSettings(params, user){
  let school_vls_id = params.school_vls_id
  
  let schooMeeting = await SchoolMeetingSettings.findOne({
      where : {school_vls_id : school_vls_id},
      include: [{ 
                model:VlsVideoServices,
                as:'video_service'
              }]
  });

  return { success: true, message: "view school meeting settings", data:schooMeeting }
  
  
}


/**
 * API for update school meeting settings
 */
async function updateSchoolMeetingSettings(params, body){
  
  let settings = await SchoolMeetingSettings.findOne({
    where :{ meeting_setting_id: params.meeting_setting_id }
  });
  if(!settings) throw 'settings not found'
      settings.update(body)

  return { success: true, message: "school meeting settings", data:settings }
  
}


/**
 * API for delete school meeting settings
 */
async function deleteSchoolMeetingSettings(params, user){
  
  let settings = await SchoolMeetingSettings.findOne({
    where :{ meeting_setting_id: params.meeting_setting_id }
  });

  if(!settings) throw 'settings not found'

   settings.destroy();

  return { success: true, message: "school meeting settings deleted",}
  
}



/**
 * API for create vls video service 
 */
async function createVlsVideoServices(body, user){

  settings = await VlsVideoServices.create(body);
  
  return { success: true, message: "vls video services", data:settings }
  
}





/**
 * API for create vls video service 
 */
async function listVlsVideoServices(query, user){
  let whereCondition = {}
  
  if(query.branch_vls_id) 
    whereCondition.branch_vls_id = query.branch_vls_id

  if(query.school_vls_id) 
    whereCondition.school_vls_id = query.school_vls_id

  let services = await VlsVideoServices.findAll({
    where : whereCondition
  });
  
  return { success: true, message: "list vls video services", data:services }
  
}



/**
 * API for create vls video service 
 */
async function viewVlsVideoServices(params, user){
  
  let videoSettings = await VlsVideoServices.findOne({
    where :{ video_service_id: params.video_service_id }
  });

  return { success: true, message: "view vls video services", data:videoSettings }
}



/**
 * API for create vls video service 
 */
async function viewVlsVideoServices(params, user){
  
  let videoSettings = await VlsVideoServices.findOne({
    where :{ video_service_id: params.video_service_id }
  });

  return { success: true, message: "view vls video services", data:videoSettings }
}


/**
 * API for update vls service settings
 */
async function updateVlsVideoServices(params, body){
  
  let settings = await VlsVideoServices.findOne({
    where :{ video_service_id: params.video_service_id }
  });
  
  if(!settings) throw 'settings not found'
      settings.update(body)

  return { success: true, message: "school meeting settings", data:settings }
  
}


/**
 * API for delete vls service settings
 */
async function deleteVlsVideoServices(params, user){
  
  let settings = await VlsVideoServices.findOne({
    where :{ video_service_id: params.video_service_id }
  });

  if(!settings) throw 'settings not found'

   settings.destroy();

  return { success: true, message: "school meeting settings deleted",}
  
}


/**
 * API for create vls video service 
 */
async function vlsVideoServicesDropdown(query, user){
  let whereCondition = {}
  
  if(query.branch_vls_id) 
    whereCondition.branch_vls_id = query.branch_vls_id

  if(query.school_vls_id) 
    whereCondition.school_vls_id = query.school_vls_id
  
  if(!query.school_vls_id && !query.branch_vls_id){
      whereCondition.branch_vls_id = null
      whereCondition.school_vls_id = null
  }

  let services = await VlsVideoServices.findAll({
    where : whereCondition
  });
  
  return { success: true, message: "list vls video services", data:services }
  
}


/**
 * API for provider Dropdown 
 */
async function providerDropdown(query, user){
  
  let service_Provider = await ServiceProvider.findAll();
  
  return { success: true, message: "list vls video services", data:service_Provider }
  
}

async function getMeetingCounts(condition){
  let obj              = {}
  let statuses         = ['past','today','upcoming']
  let currentDate      = moment().format('YYYY-MM-DD')

  await Promise.all(
    statuses.map(async status => {
      let resetCondition = {}

      if(status == 'past'){
        resetCondition[Op.lt] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '<', currentDate)
      }else if(status == 'upcoming'){
        resetCondition[Op.gt] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '>', currentDate)
      }else{
        resetCondition[Op.eq] = sequelize.where(sequelize.fn('date', sequelize.col('meeting_date')), '=', currentDate)
      }
      resetCondition = Object.assign(resetCondition, condition); 
  
      obj[status] = await VlsMeetings.count({
        where:resetCondition
      })

    })
  )
    
  return obj
}