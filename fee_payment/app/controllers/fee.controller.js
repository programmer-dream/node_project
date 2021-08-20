const db 	 	            = require("../../../models");
const moment 	          = require("moment");
const path              = require('path')
const axios             = require('axios').default;
const config            = require("../../../config/env.js");
const FormData          = require('form-data');
const CryptoJS          = require('crypto-js');
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
const InvoiceDetail     = db.InvoiceDetail;
const Transaction       = db.Transaction;
const Branch            = db.Branch;



module.exports = {
  list,
  view,
  postFeeRequest,
  cardDetailsGetLink,
  vendorCreate,
  vendorUpdate,
  tansactionCreate,
  tansactionCheck,
  listTransaction
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
            },{
                model:InvoiceDetail,
                as:'invoice_detail'
            }]
  })

  if(!allInvoices) throw 'Invoice not exists'
  
  return { success: true, message: "fee view",data:allInvoices}
};


/**
 * API for payment process
 */
async function postFeeRequest(body,params , user){
  let cashFreeConfig = await getCashFreeConfig();
  if(!body.invoiceId) throw 'invoiceId is required'

  let authUser = await Authentication.findOne({
    where:{
            user_name : user.userId,
            user_vls_id : user.userVlsId,
          }
  })
  
  let orderID = "order_"+body.invoiceId
  let paymentOrderDetails = await getOrderStatus(orderID)
  if(paymentOrderDetails && paymentOrderDetails.order_status == "ACTIVE"){
    return { success: true, message: "payment order token",data:{order_token: paymentOrderDetails.order_token}}
  }

  invoice_id = body.invoiceId
  let getInvoice = await Invoice.findOne({
    where: {custom_invoice_id : invoice_id} 
  })
  
  let branch_vls_id = params.branch_id
  let branch = await Branch.findByPk(branch_vls_id)
  if(!branch) throw 'Error while fetching branch'
   
  let vendor_percentage = [{
         "vendorId" : branch.vendor_id,
         "percentage" : parseInt(branch.vendor_percentage)
  }]
  return vendor_percentage
  let objJsonStr = Buffer.from(JSON.stringify(vendor_percentage)).toString("base64")

  let data = new FormData();
  data.append('appId', cashFreeConfig.app_id);
  data.append('secretKey', cashFreeConfig.secret);
  data.append('orderId', orderID);
  data.append('orderAmount', getInvoice.net_amount);
  data.append('orderCurrency', 'INR');
  data.append('orderNote', (getInvoice.note)? getInvoice.note : "");
  data.append('customerEmail', authUser.recovery_email_id);
  data.append('customerName', authUser.name);
  data.append('customerPhone', authUser.recovery_contact_no);
  data.append('returnUrl', body.returnUrl);
  data.append('paymentModes', 'dc,cc');
  data.append('paymentSplits', objJsonStr);
  //return data
  var config = {
    method: 'post',
    url: `${cashFreeConfig.url}/api/v1/order/create`,
    headers: { 
      ...data.getHeaders()
    },
    data : data
  };

  let cashfreeCreateOrder = await axiosRequest(config);

  if(cashfreeCreateOrder && cashfreeCreateOrder.status == "OK"){
    let paymentOrderDetails = await getOrderStatus(orderID)
    return { success: true, message: "payment order token",data:{order_token: paymentOrderDetails.order_token}}
  }
  
  throw "Error while creating ayment token"
  
};


/**
 * API to send request to cashfree getorder status
 */
async function getOrderStatus(orderId){
  let cashFreeConfig = await getCashFreeConfig();

  var config = {
        method: 'get',
        url: `${cashFreeConfig.sandboxUrl}/pg/orders/${orderId}`,
        headers: { 
          'x-api-version': '2021-05-21', 
          'x-client-id': cashFreeConfig.app_id, 
          'x-client-secret': cashFreeConfig.secret
        }
      };

    return axiosRequestOrderStatus(config).then(function (response) {
                return response
            })
            .catch(function (error) {
                return error
            });

}

/**
 * API for vendor create
 */
async function vendorCreate(body, params){
  let cashFreeConfig = await getCashFreeConfig();
  let branch_vls_id     = params.branch_id
  let branch = await Branch.findByPk(branch_vls_id)

  if(!branch) throw 'Error while fetching branch'

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
    await branch.update(branch_data)
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
 * API for order status axios request
 */
async function axiosRequestOrderStatus(config){

  return new Promise((resolve, reject) => {
        return axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {

                reject(error.response.data)
            });
    })
}

/**
 * API for axios request
 */
async function getCashFreeConfig(){

  return {
          url                 : config.cash_free_url,
          sandboxUrl          : config.cashfree_url,
          app_id              : config.cash_free_app_id,
          secret              : config.cash_free_secret,
          crypto_secret       : config.crypto_secret
         }
}


/**
 * API for vendor update
 */
async function vendorUpdate(body, params){
  let cashFreeConfig = await getCashFreeConfig();
  let branch_vls_id     = params.branch_id
  let branch = await Branch.findByPk(branch_vls_id)

  if(!branch) throw 'Error while fetching branch'

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
    if(body.status == "DELETED"){
      branch_data = { vendor_percentage: "", vendor_id: "",vendor_details: ""}
    }
    await branch.update(branch_data)
  }
  
  return { success: true, message: "Vendor updated successfully",data:body}
};


/**
 * API for card details to send on cashfree to get link
 */
async function cardDetailsGetLink(body){

  let cashFreeConfig = await getCashFreeConfig();
  let cryptoSecret = cashFreeConfig.crypto_secret

  let bytes = CryptoJS.AES.decrypt(body.details, cryptoSecret);
  let bodyJson = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  var data = JSON.stringify(bodyJson);

    var config = {
      method: 'post',
      url: `${cashFreeConfig.sandboxUrl}/pg/orders/pay`,
      headers: { 
        'x-version': '2021-05-21', 
        'Content-Type': 'application/json'
      },
      data : data
    };

    let otplinkResponse = await axiosRequest(config);

  return { success: true, message: "cashfree otp link",data:otplinkResponse}
};

/**
 * API for create tansaction
 */
async function tansactionCreate(body, user){
  if(!body.invoiceID) throw 'invoiceID is required'
  if(!body.school_id) throw 'school_id is required'
  if(!body.branch_id) throw 'branch_id is required'

    let academicYear = await AcademicYear.findOne({
        where : {
              school_id  : body.school_id,
              is_running : 1,

            }
      });
  
  let invoiceID = body.invoiceID
  let orderID = "order_"+invoiceID
  let createdTransaction = {}
  let paymentOrderDetails = await getOrderStatus(orderID)

  if(paymentOrderDetails && paymentOrderDetails.order_id == orderID){
      let transactionObj = {
          school_id: body.school_id,
          branch_id: body.branch_id,
          academic_year_id:  academicYear.id,
          invoice_id: invoiceID,
          amount: paymentOrderDetails.order_amount,
          payment_method: paymentOrderDetails.order_meta.payment_methods,
          transaction_id: paymentOrderDetails.cf_order_id,
          payment_date: moment().format('YYYY-MM-DD H:m:s'),
          pum_first_name: paymentOrderDetails.customer_details.customer_name,
          pum_email: paymentOrderDetails.customer_details.customer_email,
          pum_phone: paymentOrderDetails.customer_details.customer_phone,
          transaction_status: paymentOrderDetails.order_status,
          created_by: user.userVlsId,
          created_by_role: user.role,
      } 
      createdTransaction = await Transaction.create(transactionObj)
  }
  return { success: true, message: "Transaction created successfully",data:createdTransaction}
};


/**
 * API for create tansaction
 */
async function tansactionCheck(body){
  console.log(body)
  return {id:3}
};

/**
 * API for list tansaction
 */
async function listTransaction(pramas, user){

  return { success: true, message: "List transaction",data:pramas}
}
