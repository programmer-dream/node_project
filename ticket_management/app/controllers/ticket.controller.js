const { validationResult } = require('express-validator');
const {updateRewardsPoints , getUserRewardsPoint, updateReedeemPoint} = require('../../../helpers/update-rewards')
const db 	 	     = require("../../../models");
const moment 	   = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const exceljs    = require('exceljs')
const Op 	 	     = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const User       = db.Authentication;
const Employee   = db.Employee;
const sequelize  = db.sequelize;
const SchoolDetails= db.SchoolDetails;
const Branch  		 = db.Branch;
const Role         = db.Role;
const Ticket       = db.Ticket;
const TicketRating = db.TicketRating;
const VlsRewards   = db.VlsRewards;

module.exports = {
  create,
  view,
  list,
  update,
  deleteTicket,
  dashboardCount,
  getRating,
  exportTickets,
  changeStatus,
  counts
};


/**
 * API for create ticket
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let ticket_data = req.body
  
  if(ticket_data.redeem_point){
     let point = await getUserRewardsPoint(req.user)
     let minPoint = await VlsRewards.findOne({
      attributes:['min_point_redeemed']
     })
     minPoint = minPoint.min_point_redeemed
     if(ticket_data.redeem_point < minPoint) throw "Min "+minPoint+" points to redeem"

     if(ticket_data.redeem_point > point) throw "You don't have sufficient points to redeem"
     let redeemPoint = ticket_data.redeem_point
     await updateReedeemPoint(req.user, redeemPoint)
  }
  
  if(req.files.file && req.files.file.length > 0){
      ticket_data.attachment = req.body.uplodedPath + req.files.file[0].filename;
  }

  let user                   = req.user
  //modify data
  ticket_data.user_id        = user.userVlsId
  ticket_data.user_type      = user.role
  ticket_data.status      	 = 'new'
  ticket_data.open_date      = moment().format('YYYY-MM-DD HH:mm:ss')

  slug = 'branch-admin'
  if(user.role == 'school-admin' || user.role == 'branch-admin')
     slug = 'super-admin'

  if(ticket_data.redeem_point)
      slug = 'super-admin'
  //get branch admin
  let role = await Role.findOne({
    where : { slug : slug },
    attributes : ['id']
  })

  let userCondition = { 
    role_id   : role.id
  }

  if(slug=='branch-admin'){
      userCondition.school_id = ticket_data.school_vls_id
      userCondition.branch_vls_id = ticket_data.branch_vls_id
  }

  let getUser = await User.findOne({
    where: userCondition
  })
  if(!getUser)
     throw 'User not found'
   
  ticket_data.assigned_user_id   = getUser.user_vls_id
  ticket_data.assigned_user_type = 'employee'
  
  //create ticket
  ticket = await Ticket.create(ticket_data);

  if(ticket.ticket_type != 'rewards')
      await updateRewardsPoints(user, 'create_support_ticket', "increment")

  return { success: true, message: "Ticket created successfully", data : ticket}
};


/**
 * API for view ticket
 */
async function view(id, user){
	let ticket = await Ticket.findByPk(id);

  if(user.role != 'school-admin' && user.role != 'branch-admin' && user.role != 'super-admin'){
    if(ticket.user_id != user.userVlsId || ticket.user_type != user.role){
      throw 'You are not authorised'
    }
  }
  if(user.role == 'school-admin' || user.role == 'branch-admin'){
    if(ticket.ticket_type == 'rewards') throw 'You are not authorised'
  }

  if(ticket){
    let role = await Role.findAll({
      where : {slug : { [Op.in]: ['guardian','student'] } },
      attributes: ['id']
    }).then(roles => roles.map( role => role.id));
    
    ticket = ticket.toJSON()
    let authUser = await User.findOne({
        where : { 
            user_vls_id : ticket.assigned_user_id,
            role_id : { [Op.notIn]: role }
        },
        include: [{ 
                    model:Role,
                    as:'roles',
                    attributes: ['slug']
                  }]
      })
      ticket.assigned_role = authUser.roles.slug
  }

	return { success: true, message: "Ticket view", data : ticket}
}


/**
 * API for list tickets
 */
async function list(params , user){
	let limit   = 10
	let offset  = 0
	let orderBy = 'desc';
	let search  = ''
  let authUser = await User.findByPk(user.id)

  let role = await Role.findOne({
        where : { slug : 'super-admin' },
        attributes : ['id']
      })

  let getUser = await User.findOne({
    where: { 
              role_id   : role.id
           }
  })

  if(params.search) 
     search = params.search

  let whereCondition = {
      [Op.or]:{
                description: { 
                  [Op.like]: `%`+search+`%`
                },
                subject : { 
                  [Op.like]: `%`+search+`%` 
                }
           }
    };

  if(user.role == 'super-admin'){
      //whereCondition.assigned_user_id = user.userVlsId
      if(params.school_vls_id)
          whereCondition.school_vls_id = params.school_vls_id
      if(params.branch_vls_id)
          whereCondition.branch_vls_id = params.branch_vls_id

  }else if(user.role != 'school-admin' && user.role != 'branch-admin' && user.role !='principal'){
      whereCondition.user_id   = user.userVlsId
      whereCondition.user_type = user.role
  }else{
      if(params.branch_vls_id)
          whereCondition.branch_vls_id = params.branch_vls_id

      whereCondition.school_vls_id = authUser.school_id
      whereCondition.ticket_type = { [Op.ne] : 'rewards'}
  }


  if(params.ticket_priorty) 
     whereCondition.ticket_priorty = params.ticket_priorty

  if(params.status) 
     whereCondition.status = params.status
  
  if(params.ticket_type)
     whereCondition.ticket_type = params.ticket_type

  if(params.ticket_vls_id)
     whereCondition.ticket_vls_id = params.ticket_vls_id
  
  if(params.is_exalted)
     whereCondition.assigned_user_id = getUser.user_vls_id

  if(params.module_type)
     whereCondition.module_type = params.module_type

	if(params.orderBy == 'asc') 
	 	 orderBy = params.orderBy

	if(params.size)
	 	 limit = parseInt(params.size)

	if(params.page)
	   offset = 0 + (parseInt(params.page) - 1) * limit
  
	let tickets = await Ticket.findAll({
		limit : limit,
	    offset: offset,
	    where : whereCondition,
	    order : [
	             ['ticket_vls_id', orderBy]
	            ]
            });

	return { success: true, message: "Ticket listing", data : tickets}
}


/**
 * API for update ticket
 */
async function update(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let ticket_data = req.body

  if(req.files.file && req.files.file.length > 0){
      ticket_data.attachment = req.body.uplodedPath + req.files.file[0].filename;
  }

  let user       = req.user
  let ticketId   = req.params.id
   //create ticket
  ticket = await Ticket.findByPk(ticketId);

  ticket.update(ticket_data)

  return { success: true, message: "Ticket updated successfully", data : ticket}
};


/**
 * API for delete ticket
 */
async function deleteTicket(id){

	let ticket = await Ticket.findByPk(id);
	if(!ticket) throw 'Ticket not found'

	ticket.destroy();

	return { success: true, message: "Ticket deleted successfully"}
}


/**
 * API for view dashboardCount
 */
async function dashboardCount(params, user){
  let whereCondition = {}
  whereCondition[Op.or] = [{ 
                  user_id: user.userVlsId,
                  user_type : user.role
                }]
  if(user.role =='super-admin' || user.role =='branch-admin'){
     whereCondition[Op.or] = [{ 
                  user_id: user.userVlsId,
                  user_type : user.role
                },{ 
                  assigned_user_id: user.userVlsId
                }]

  }
  
      whereCondition.status = 'new'
  let newTicketes = await Ticket.count({where: whereCondition})
      whereCondition.status = 'assigned'
  let assignedTicketes = await Ticket.count({where: whereCondition})
      whereCondition.status = 'wip'
  let wipTicketes = await Ticket.count({where: whereCondition})
      whereCondition.status = 'resolved'
  let resolvedTicketes = await Ticket.count({where: whereCondition})
  
  let allCounts = {
    new       : newTicketes,
    assigned  : assignedTicketes,
    wip       : wipTicketes,
    resolved  : resolvedTicketes
  }
  return { success: true, message: "dashboard count", data : allCounts}
}


/**
 * API for get rating & likes
 */
async function getRating(id, user) {
  try{
    //get rating avg
    let ratings = await TicketRating.findOne({
      attributes: [
                    [ Sequelize.fn('AVG', Sequelize.col('ratings')), 'total_ratings' ]
                  ],
      where:{ticket_vls_id:id},
      group:['ticket_vls_id']
    })

    let avg = 0
    if(ratings){
      ratings = ratings.toJSON()
      avg     = ratings.total_ratings
    }

    userRating  = await TicketRating.findOne({
      attributes: ['ratings'],
      where:{ticket_vls_id:id,user_vls_id:user.userVlsId}
    })

    return { success:true, message:"Rating data",avg:avg, data:userRating};
  }catch(err){
    throw err.message
  }
};


/**
 * API for export data 
 */
async function exportTickets(params){
    let startDate = params.startDate
    let endDate   = params.endDate
    
    let tickets = await Ticket.findAll({
                    where : {
                      [Op.and]: [
                            sequelize.where(sequelize.fn('date', sequelize.col('open_date')), '>=', startDate),
                            sequelize.where(sequelize.fn('date', sequelize.col('open_date')), '<=', endDate),
                        ]},
                        attributes:['ticket_vls_id','subject','description','created_at']
                  })

    let workBook  = new exceljs.Workbook();
    let workSheet = workBook.addWorksheet('Tickets');

    workSheet.columns = [
      {header:'TicketId',key:'ticket_vls_id',width:10},
      {header:'Title',key:'subject',width:20},
      {header:'Description',key:'description',width:30},
      {header:'Created Date',key:'created_at',width:12}
    ]
    
    tickets.forEach(ticket=>{
      ticket = ticket.toJSON()
      ticket.created_at = moment(ticket.created_at).format('DD/MM/YYYY');
      workSheet.addRow(ticket);
    })

    workSheet.getRow(1).eachCell((cell)=>{
      cell.font = { bold : true };  
    })

    let buffer = await workBook.xlsx.writeBuffer()
    
    return { success : true, message : "File", data : buffer };
}


/**
 * API for get rating & likes
 */
async function changeStatus(id, body, user) {

    let status = body.status
    if(!status && !body.exalted) throw 'status field is required'

    let ticket = await Ticket.findByPk(id)
    
    updatedData = {status: status}

    if(body.exalted){

      let role = await Role.findOne({
        where : { slug : 'super-admin' },
        attributes : ['id']
      })

      let getUser = await User.findOne({
        where: { 
                  role_id   : role.id
               }
      })

      updatedData.assigned_user_id   = getUser.user_vls_id
      updatedData.status             = 'assigned'
      updatedData.ticket_type        = 'infrastructure'
    }

    if(ticket)
       ticket.update(updatedData)

     if(ticket.ticket_type =='rewards' && ticket.status =='resolved'){
        let reqPoint = ticket.redeem_point
        let userId   = ticket.user_id
        let user_type = ticket.user_type
        let dbUser = await getUserName(userId , user_type)
        
        await updateReedeemPoint(dbUser, reqPoint , true)
    }

    return { success:true, message:"Ticket status updated", data: ticket};
  
};


/**
 * API for get user name 
 */
async function getUserName(userId , user_type) {

  let role  = await Role.findOne({
    where : {slug : user_type}
  })

  let userData = await User.findOne({
      where : {
            user_vls_id :  userId,
            role_id     : role.id
      }
    })

  user = { userId : userData.user_name}

  return user
}

/**
 * API for counts ticket 
 */
async function counts(query , user){
  let whereCondition = {}
  let statusArr = ['new','resolved','assigned']

  if(user.role !='super-admin')
      return await branchCounts(query , user)

  if(query.school_vls_id) 
      whereCondition.school_id = query.school_vls_id

  let schools = await SchoolDetails.findAll({
      where : whereCondition,
     attributes : ['school_id','school_name']
  })

  if(query.status){
      if(query.status == 'open'){
        statusArr = ['new']
      }else{
        statusArr = [query.status]
      }
  }
  //return statusArr
  let schoolCounts = []
   await Promise.all(
      schools.map(async school => {
      school = school.toJSON()

      let where = { 
        school_vls_id : school.school_id,
        status : { [Op.in]: statusArr}
      }

        // console.log(where)
      let count = await Ticket.findAll({
          where : where,
          attributes : [
              'status',
              'ticket_priorty',
              [ Sequelize.fn('COUNT', Sequelize.col('ticket_priorty')), 'count' ]
          ],
          group : ['status','ticket_priorty']
      })
       
      let resolved = 0
      let open = {}
      count.forEach(function(obj){
          obj = obj.toJSON()
          if(obj.status == 'resolved'){
            resolved += obj.count
          }else{
            if(!open[obj.ticket_priorty])
                open[obj.ticket_priorty] = obj.count
          }
      })
      if(!open.hasOwnProperty('minor'))
          open.minor = 0
      if(!open.hasOwnProperty('medium'))
          open.medium = 0
      if(!open.hasOwnProperty('critical'))
          open.critical = 0

      if(query.ticket_priorty == 'minor'){
          delete open.medium
          delete open.critical
      }else if(query.ticket_priorty == 'medium'){
          delete open.minor
          delete open.critical
      }else if(query.ticket_priorty == 'critical'){
          delete open.minor
          delete open.medium
      }
      //branch.count = count
      if(query.status == 'open'){
        school.status = {open}
      }else if(query.status == 'resolved'){
        school.status = {resolved}
      }else{
        school.status = {resolved, open}
      }
      schoolCounts.push(school)
    })
  )
  return { success:true, message:"ticket counts", data : schoolCounts};
}

/**
 * API for counts community 
 */
async function branchCounts(query , user){
  let whereCondition = {}
  let statusArr = ['new','resolved']
  if(query.branch_vls_id) 
      whereCondition.branch_vls_id = query.branch_vls_id
  
  let branches = await Branch.findAll({
      where : whereCondition,
     attributes : ['branch_vls_id','branch_name']
  })
  if(query.status){
      if(query.status == 'open'){
        statusArr = ['new']
      }else{
        statusArr = [query.status]
      }
  }

  let branchCounts = []
   await Promise.all(
      branches.map(async branch => {
      branch = branch.toJSON()
      let where = { 
        branch_vls_id : branch.branch_vls_id,
        status : { [Op.in]: statusArr}
      }
      let count = await Ticket.findAll({
          where : where,
          attributes : [
              'status',
              'ticket_priorty',
              [ Sequelize.fn('COUNT', Sequelize.col('ticket_priorty')), 'count' ]
          ],
          group : ['status','ticket_priorty']
      })
      let resolved = {}
      let open = {}
      count.forEach(function(obj){
          obj = obj.toJSON()
          if(obj.status == 'resolved'){
            if(!resolved[obj.ticket_priorty])
                resolved[obj.ticket_priorty] = obj.count
          }else{
            if(!open[obj.ticket_priorty])
                open[obj.ticket_priorty] = obj.count
          }
      })
      
      if(!open.hasOwnProperty('minor'))
          open.minor = 0
      if(!open.hasOwnProperty('medium'))
          open.medium = 0
      if(!open.hasOwnProperty('critical'))
          open.critical = 0

      if(!resolved.hasOwnProperty('minor'))
          resolved.minor = 0
      if(!resolved.hasOwnProperty('medium'))
          resolved.medium = 0
      if(!resolved.hasOwnProperty('critical'))
          resolved.critical = 0

      if(query.ticket_priorty == 'minor'){
          delete open.medium
          delete open.critical
          delete resolved.medium
          delete resolved.critical
      }else if(query.ticket_priorty == 'medium'){
          delete open.minor
          delete open.critical
          delete resolved.minor
          delete resolved.critical
      }else if(query.ticket_priorty == 'critical'){
          delete open.minor
          delete open.medium
          delete resolved.medium
          delete resolved.minor
      }
      //branch.count = count
      if(query.status == 'open'){
        branch.status = {open}
      }else if(query.status == 'resolved'){
        branch.status = {resolved}
      }else{
        branch.status = {resolved, open}
      }
      //branch.count = count
      branchCounts.push(branch)
    })
  )
  return { success:true, message:"ticket counts", data : branchCounts};
}