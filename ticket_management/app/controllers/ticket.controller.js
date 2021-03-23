const { validationResult } = require('express-validator');
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
const Ticket         = db.Ticket;
const TicketRating   = db.TicketRating;


module.exports = {
  create,
  view,
  list,
  update,
  deleteTicket,
  dashboardCount,
  getRating,
  exportTickets,
  changeStatus
};


/**
 * API for create ticket
 */
async function create(req){
  const errors = validationResult(req);
  if(errors.array().length) throw errors.array()

  let ticket_data = req.body

  if(req.files.file && req.files.file.length > 0){
      ticket_data.attachment = req.body.uplodedPath + req.files.file[0].filename;
  }

  let user                   = req.user
  //modify data
  ticket_data.user_id        = user.userVlsId
  ticket_data.user_type      = user.role
  ticket_data.ticket_type    = await getTicketType(user)
  ticket_data.status      	 = 'new'
  ticket_data.open_date      = moment().format('YYYY-MM-DD HH:mm:ss')

  slug = 'branch-admin'
  if(user.role == 'school-admin' || user.role == 'branch-admin')
     slug = 'super-admin'
  
  //get branch admin
  let role = await Role.findOne({
    where : { slug : slug },
    attributes : ['id']
  })

  let getUser = await User.findOne({
    where: { 
              role_id   : role.id
           }
  })

  ticket_data.assigned_user_id   = getUser.user_vls_id
  ticket_data.assigned_user_type = 'employee'
  
  //create ticket
  ticket = await Ticket.create(ticket_data);
  
  return { success: true, message: "Ticket created successfully", data : ticket}
};


/**
 * API for view ticket
 */
async function view(id){
	let ticket = await Ticket.findByPk(id);

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
  let authUser = await User.findByPk(user.userVlsId)

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
      whereCondition.assigned_user_id = user.userVlsId
  }else if(user.role != 'school-admin' && user.role != 'branch-admin' && user.role !='principal'){
      whereCondition.user_id   = user.userVlsId
      whereCondition.user_type = user.role
  }else{
      whereCondition.school_vls_id = authUser.school_id
  }

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
async function dashboardCount(id){
  let ticket = await Ticket.count({
    attributes: [
                  [ Sequelize.fn('COUNT', Sequelize.col('status')), 'total_count' ]
                ],
    group:['status']
  });

  return { success: true, message: "dashboard count", data : ticket}
}


/**
 * API for get ticket type 
 */
async function getTicketType(user){
  if(user.role == 'school-admin' || user.role == 'branch-admin')
    return 'infrastructure'

  return 'application'  
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
    ratings = ratings.toJSON()
    let avg = ratings.total_ratings

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
    if(!status) 'status field is required'

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
    }
    
    if(ticket)
       ticket.update(updatedData)

    return { success:true, message:"Ticket status updated", data: ticket};
  
};