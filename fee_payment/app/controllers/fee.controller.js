const db 	 	            = require("../../../models");
const moment 	          = require("moment");
const path              = require('path')
const axios             = require('axios').default;
const config            = require("../../../config/env.js");
const Op 	 	            = db.Sequelize.Op;
const Sequelize         = db.Sequelize;
const sequelize         = db.sequelize;
const Student           = db.Student;
const Authentication    = db.Authentication;
const Guardian   	      = db.Guardian;
const Classes   	      = db.Classes;
const SchoolDetails     = db.SchoolDetails;
const AcademicYear      = db.AcademicYear;
const Invoice           = db.Invoice;
const Transaction       = db.Transaction;
const Branch            = db.Branch;



module.exports = {
  list,
  view,
  postFeeRequest,
  vendorCreate,
  vendorUpdate
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

  return { success: true, message: "fee listing", data: allInvoices}
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

  if(!allInvoices) throw 'Invoice not exists'
  
  return { success: true, message: "fee view",data:allInvoices}
};


/**
 * API for payment process
 */
async function postFeeRequest(body){
  let paymentRequestParams = body
  return { success: true, message: "payment request form",data:paymentRequestParams}
};

/**
 * API for vendor create
 */
async function vendorCreate(body, params){
  let cashFreeConfig = await getCashFreeConfig();
  
  let branch_vls_id     = params.branch_id

  let branch_data = {
      vendor_percentage: body.vendor_percentage,
      vendor_id        : body.id,
      vendor_details   : JSON.stringify(body)
  }

  delete body.vendor_percentage

  var data = JSON.stringify(body);
  
  var config = {
    method: 'post',
    url: `${cashFreeConfig.url}/api/v2/easy-split/vendors`,
    headers: { 
      'x-client-id': cashFreeConfig.app_id, 
      'x-client-secret': cashFreeConfig.secret, 
      'Content-Type': 'application/json'
    },
    data : data
  };

  let cashfreeVendorData = await axiosRequest(config);

  if(cashfreeVendorData && cashfreeVendorData.status == 'OK'){
    let branch = await Branch.findByPk(branch_vls_id)
    if(branch)
        branch.update(branch_data)
  }
  
  return { success: true, message: "Vendor created successfully",data:body}
};


/**
 * API for axios request
 */
async function axiosRequest(config){

  return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error)
            });
    })
}

/**
 * API for axios request
 */
async function getCashFreeConfig(){

  return {
          url   : config.cash_free_url,
          app_id: config.cash_free_app_id,
          secret: config.cash_free_secret
         }
}


/**
 * API for vendor update
 */
async function vendorUpdate(body, params){
  let cashFreeConfig = await getCashFreeConfig();
  //return body
  let branch_vls_id     = params.branch_id

  let branch_data = {
      vendor_percentage: body.vendor_percentage,
      vendor_id        : body.id,
      vendor_details   : JSON.stringify(body)
  }

  delete body.vendor_percentage
  delete body.id

  var data = JSON.stringify(body);
  
  var config = {
    method: 'put',
    url: `${cashFreeConfig.url}/api/v2/easy-split/vendors/${branch_data.vendor_id}`,
    headers: { 
      'x-client-id': cashFreeConfig.app_id, 
      'x-client-secret': cashFreeConfig.secret, 
      'Content-Type': 'application/json'
    },
    data : data
  };

  let cashfreeVendorData = await axiosRequest(config);

  if(cashfreeVendorData && cashfreeVendorData.status == 'OK'){
    let branch = await Branch.findByPk(branch_vls_id)
    if(branch)
        branch.update(branch_data)
  }
  
  return { success: true, message: "Vendor updated successfully",data:body}
};