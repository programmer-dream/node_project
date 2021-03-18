const { validationResult } = require('express-validator');
const db 	 	     = require("../models");
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
  exportTickets
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

  let user        = req.user
  //modify data
  ticket_data.user_id        = user.userVlsId
  ticket_data.user_type      = user.role
  ticket_data.ticket_type    = await getTicketType(user)
  ticket_data.status      	 = 'new'
  ticket_data.ticket_priorty = 'minor'
  ticket_data.open_date      = moment().format('YYYY-MM-DD HH:mm:ss')
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
	let whereCondition  = {}

  if(user.role == 'super-admin'){
      whereCondition.ticket_type = 'infrastructure'
  }else if(user.role != 'school-admin' && user.role != 'branch-admin' && user.role !='principal'){
      whereCondition.user_id   = user.userVlsId
      whereCondition.user_type = user.role
  }else{
      whereCondition.school_vls_id = authUser.school_id
  }

	if(params.search) 
	   search = params.search

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
                        ]}
                  })
    let workBook = new exceljs.Workbook();
    let workSheet = workBook.addWorksheet('Tickets');
    
    workSheet.columns = [
      {header:'TicketId',key:'ticket_vls_id'},
      {header:'Title',key:'subject'},
      {header:'Description',key:'description'},
      {header:'Created Date',key:'created_at'}
    ]

    tickets.forEach(ticket=>{
      workSheet.addRow(ticket);
    })

    workSheet.getRow(1).eachCell((cell)=>{
      cell.font = { bold : true };  
    })

    let buffer = await workBook.xlsx.writeBuffer()

    return buffer
}