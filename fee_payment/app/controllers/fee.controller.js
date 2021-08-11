const { validationResult } = require('express-validator');
const db 	 	 = require("../../../models");
const moment 	 = require("moment");
const bcrypt     = require("bcryptjs");
const path       = require('path')
const mailer     = require('../../../helpers/nodemailer')
const axios     = require('axios').default;
const Op 	 	 = db.Sequelize.Op;
const Sequelize  = db.Sequelize;
const sequelize  = db.sequelize;
const Student    = db.Student;
const Section    = db.Section;
const SubjectList    = db.SubjectList;
const Authentication = db.Authentication;
const Guardian   	 = db.Guardian;
const Classes   	 = db.Classes;
const SchoolDetails = db.SchoolDetails;
const Employee 		= db.Employee;
const Branch  		= db.Branch;
const VlsMeetings = db.VlsMeetings;
const AcademicYear   = db.AcademicYear;
const VlsVideoServices  = db.VlsVideoServices;
const Notification   = db.Notification;
const Invoice        = db.Invoice;
const Transaction    = db.Transaction;




module.exports = {
  list,
  view
};


/**
 * API for list fee
 */
async function list(params, user){
  let orderBy          = 'desc';
  let limit            = 10
  let offset           = 0
  let currentMonth     =  moment().format('MMMM')

  let whereCodition    = { month : currentMonth}

  if(user.role == 'student')
     whereCodition.student_id = user.userVlsId

  if(user.role == 'guardian'){
      let childIds = await Student.findAll({
        where : { parent_vls_id: user.userVlsId},
        attributes : ['student_vls_id']

      }).then(students => students.map( student => student.student_vls_id));
      whereCodition.student_id = { [Op.in] : childIds }
  }

  let authentication = await Authentication.findByPk(user.id)
  let academicYear = await AcademicYear.findOne({
        where : {
              school_id  : authentication.school_id,
              is_running : 1,

            }
      });

  if(academicYear)
    whereCodition.academic_year_id = academicYear.id

  if(params.class_id)
    whereCodition.class_id = params.class_id

  if(params.branch_vls_id)
    whereCodition.branch_id = params.branch_vls_id

  if(params.school_vls_id)
    whereCodition.school_id = params.school_vls_id

  if(params.student_vls_id)
    whereCodition.student_id = params.student_vls_id

  if(params.paid_status)
    whereCodition.paid_status = params.paid_status

  if(params.month)
     whereCodition.month = moment(params.month, 'M').format('MMMM')
  
  let allInvoices = await Invoice.findAll({
    where : whereCodition,
    limit : limit,
    offset: offset,
    order: [
             ['id', orderBy]
           ],
    include: [{ 
                model:Student,
                as:'student'
              },{ 
                model:Transaction,
                as:'transaction'
             },{ 
                model:Classes,
                as:'class'
             }]
  })

  return { success: true, message: "fee listing",data:allInvoices}
};


/**
 * API for list view
 */
async function view(params, user){
  let whereCodition = {id : params.id}

  let allInvoices = await Invoice.findOne({
    where : whereCodition,
    include: [{ 
                model:Student,
                as:'student'
            },{ 
                model:Transaction,
                as:'transaction'
             },{ 
                model:Classes,
                as:'class'
             }]
  })
  
  return { success: true, message: "fee listing",data:allInvoices}
};


