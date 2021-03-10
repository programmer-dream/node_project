const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
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


module.exports = {
  create,
  view,
  list,
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
  deleteUser
};


/**
 * API for create a school
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let data   = req.body
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
  let schools = await SchoolDetails.findAll({
    limit : limit,
    offset: offset,
    where : whereCondition,
    order : [
             ['school_id', orderBy]
            ]
  })
  
  return { success: true, message: "School list", data : schools}
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
  let branch = await Branch.findByPk(id)
  if(!branch) throw 'branch not found'

  let role = await Role.findOne({
      where : { slug :'branch-admin' },
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
  return { success: true, message: "Branch view", data : {branch, users}}
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
      school_id : id,
      is_deleted : 0
    };

  let branches = await Branch.findAll({
  	  limit : limit,
      offset: offset,
      where : whereCondition,
      order : [
               ['branch_vls_id', orderBy]
              ]
  })
  
  return { success: true, message: "Branch list", data : branches}
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
  delete data.type
  delete data.password
  delete data.school_id
  let employee  = await Employee.create(data)
  let userData  = {
                    user_name     : Date.now(),
                    user_vls_id   : employee.faculty_vls_id,
                    school_id     : school_id,
                    branch_vls_id : branch_vls_id,
                    role_id       : role_id,
                    password      : password,
                    recovery_email_id : data.email,
                    old_passwords : JSON.stringify([password]),
                    name          : data.name,
                    photo         : data.photo
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

  await Employee.destroy({
    where : {faculty_vls_id : user.user_vls_id}
  })

  await user.destroy()
    
  return { success: true, message: "User deleted successfully" }
}