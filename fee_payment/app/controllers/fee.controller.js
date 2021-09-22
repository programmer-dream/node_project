const db 	 	            = require("../../../models");
const moment 	          = require("moment");
const path              = require('path')
const axios             = require('axios').default;
const configEnv         = require("../../../config/env.js");
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
const IncomeHead        = db.IncomeHead;



module.exports = {
  list,
  view,
  postFeeRequest,
  cardDetailsGetLink,
  vendorCreate,
  vendorUpdate,
  tansactionCheck,
  listTransaction,
  viewTransaction,
  collectionReports,
  dashboardInvocesAndTransaction,
  dashboardForAdminPrincipal
};


/**
 * API for list fee
 */
async function list(params, user){
  let orderBy          = 'desc';
  let limit            = 10
  let offset           = 0

  let whereCodition    = {}

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
  
  if(params.orderBy)
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

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

  let invoiceDetails = await Invoice.findOne({
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
                as:'invoice_detail',
                include: [{ 
                    model:IncomeHead,
                    as:'income_head'
                }]
            }]

  })

  if(!invoiceDetails) throw 'Invoice not exists'
  
  if(user.role == 'student'){
    if(invoiceDetails.student_id != user.userVlsId) throw 'You are not authorised'
  }

  if(user.role == 'guardian'){
     let students = await Student.findAll({
          where : { parent_vls_id : user.userVlsId},
          attributes: ['student_vls_id']
        }).then(students => students.map( student => student.student_vls_id));

     if(!students.includes(invoiceDetails.student_id)) throw 'You are not authorised'
  }
  let school_id = invoiceDetails.student.school_id
  let branch_id = invoiceDetails.student.branch_vls_id

  let schoolDetails = await SchoolDetails.findOne({ 
                    where: { school_id: school_id },
                    attributes: ['school_vls_id','school_name', 'address','school_code','logo']
                    })

  let branchDetails = {}
  if(branch_id && branch_id != ""){

    branchDetails = await Branch.findOne({ 
                      where: { branch_vls_id: branch_id },
                      attributes: ['branch_vls_id','branch_name', 'address']
                      })
  }

  invoiceDetails = invoiceDetails.toJSON()
  invoiceDetails.school_details = schoolDetails
  invoiceDetails.branch_details = branchDetails

  return { success: true, message: "fee view",data:invoiceDetails}
};


/**
 * API for list view Transaction
 */
async function viewTransaction(params, user){
  let whereCodition = {id : params.id}

  let transactionDetails = await Transaction.findOne({
    where : whereCodition,
    include: [{ 
                model:Invoice,
                as:'invoice'
            }]
  })

  if(!transactionDetails) throw 'Transaction not exists'

  let invoiceDetails = transactionDetails.invoice
  
  if(user.role == 'student'){
    if(invoiceDetails.student_id != user.userVlsId) throw 'You are not authorised'
  }
  
  if(user.role == 'guardian'){
     let students = await Student.findAll({
          where : { parent_vls_id : user.userVlsId},
          attributes: ['student_vls_id']
        }).then(students => students.map( student => student.student_vls_id));

     if(!students.includes(invoiceDetails.student_id)) throw 'You are not authorised'
  }

  return { success: true, message: "Transaction view",data:transactionDetails}
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

  let currentUserObj = {
    user_vls_id: user.userVlsId.toString(),
    user_vls_role: user.role.toString(),
    branch_vls_id: authUser.branch_vls_id.toString(),
    school_vls_id: authUser.school_id.toString(),
    school_code: authUser.school_code.toString(),
    invoice_id: getInvoice.id.toString()
  }
  
  let objJsonStr = Buffer.from(JSON.stringify(vendor_percentage)).toString("base64")
  let  merchantData = JSON.stringify(currentUserObj)
  let returnUrl = configEnv.backendURL+"/fee/tansactionCheck"

  let data = new FormData();
  data.append('appId', cashFreeConfig.app_id);
  data.append('secretKey', cashFreeConfig.secret);
  data.append('orderId', orderID);
  data.append('orderAmount', getInvoice.net_amount);
  data.append('orderCurrency', 'INR');
  data.append('orderNote', merchantData);
  data.append('customerEmail', authUser.recovery_email_id);
  data.append('customerName', authUser.name);
  data.append('customerPhone', authUser.recovery_contact_no);
  data.append('returnUrl', returnUrl);
  data.append('paymentModes', 'dc,cc');
  data.append('paymentSplits', objJsonStr);
  
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
          url                 : configEnv.cash_free_url,
          sandboxUrl          : configEnv.cashfree_url,
          app_id              : configEnv.cash_free_app_id,
          secret              : configEnv.cash_free_secret,
          crypto_secret       : configEnv.crypto_secret
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
  // let bodyJson = body
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
async function tansactionCheck(body){

  let orderID = body.orderId
  let txStatus = body.txStatus
  let paymentMode = body.paymentMode
  let paymentOrderDetails = await getOrderStatus(orderID)
  let invoiceID = orderID.replace('order_', '')
  let orderNote = paymentOrderDetails.order_note.replace(/&quot;/g, '')
  orderNote = orderNote.replace('{', '')
  orderNote = orderNote.replace('}', '')

  var properties = orderNote.split(',');
  var orderNoteObj = {};
  properties.forEach(function(property) {
      var tup = property.split(':');
      orderNoteObj[tup[0]] = tup[1];
  });

  let academicYear = await AcademicYear.findOne({
        where : {
              school_id  : orderNoteObj.school_vls_id,
              is_running : 1,

            }
      });

  let transactionObj = {
      school_id: orderNoteObj.school_vls_id,
      branch_id: orderNoteObj.branch_vls_id,
      academic_year_id:  academicYear.id,
      invoice_id: orderNoteObj.invoice_id,
      amount: paymentOrderDetails.order_amount,
      payment_method: paymentMode,
      transaction_id: paymentOrderDetails.cf_order_id,
      payment_date: moment().format('YYYY-MM-DD H:m:s'),
      pum_first_name: paymentOrderDetails.customer_details.customer_name,
      pum_email: paymentOrderDetails.customer_details.customer_email,
      pum_phone: paymentOrderDetails.customer_details.customer_phone,
      transaction_status: txStatus,
      created_by: orderNoteObj.user_vls_id,
      created_by_role: orderNoteObj.user_vls_role,
  } 

  let paid_status = {
    paid_status: "paid"
  }

  if(txStatus == "SUCCESS"){
    let invoiceDetails = await Invoice.findOne({custom_invoice_id:invoiceID})
    await invoiceDetails.update(paid_status)
  }else{
    transactionObj.transaction_failed_reason = body.txMsg
  }

  let createdTransaction = await Transaction.create(transactionObj)
  
  
  let redirectUrl = configEnv.frontendURL+"/app/payment/detail?id="+orderNoteObj.invoice_id

  return {redirectUrl: redirectUrl}
};

/**
 * API for list tansaction
 */
async function listTransaction(params, user){
  let whereCodition  = {}
  let orderBy        = 'desc';
  let limit          = 10
  let offset         = 0
  let invoiceCondition = {}

  if(params.school_vls_id)
      whereCodition.school_id = params.school_vls_id

  if(params.branch_vls_id)
      whereCodition.branch_id = params.branch_vls_id

  if(params.class_id)
      invoiceCondition.class_id = params.class_id

  if(params.student_id)
      invoiceCondition.student_id = params.student_id

  if(params.search){
      invoiceCondition[Op.or] = {
        custom_invoice_id: { 
          [Op.like]: `%`+params.search+`%`
        }
      }
  }
  if(params.orderBy)
     orderBy = params.orderBy

  if(params.size)
     limit = parseInt(params.size)

  if(params.page)
      offset = 0 + (parseInt(params.page) - 1) * limit

  if(params.transaction_status)
      whereCodition.transaction_status = params.transaction_status

  if(params.start_date){
    whereCodition [Op.gt]= sequelize.where(sequelize.fn('date', sequelize.col('payment_date')), '>=', params.start_date)
  }

  if(params.end_date){
    whereCodition [Op.lt]= sequelize.where(sequelize.fn('date', sequelize.col('payment_date')), '<=', params.end_date)
  }  
    
  let allTransaction = await Transaction.findAll({
    where : whereCodition,
    limit : limit,
    offset: offset,
    order: [
             ['id', orderBy]
           ],
    include: [{ 
                model:Invoice,
                as:'invoice',
                where:invoiceCondition
            }]
  })
  let allInvoiceIds = await Invoice.findAll({
    where: invoiceCondition,
    attributes : ['id']
  }).then(invoices => invoices.map( invoice => invoice.id));

  whereCodition.transaction_status = 'SUCCESS'
  whereCodition.invoice_id = {[Op.in] : allInvoiceIds}
  
  let totalPaid = await Transaction.findOne({
    where : whereCodition,
    attributes:[
             [ Sequelize.fn('SUM', Sequelize.col('amount')), 'amount' ],
           ]
  })
  totalPaid = totalPaid.amount
  return { success: true, message: "List transaction",data:{allTransaction, totalPaid}}
}


/**
 * API for list view
 */
async function collectionReports(params, user){
    let whereCodition = {}
    let currentMonth  = moment().format('MMMM')
    
    //role check
    if(user.role =='branch-admin' || user.role == 'principal'){
        if(!params.branch_vls_id) throw 'branch_vls_id is required'
        whereCodition.branch_id = params.branch_vls_id

    }else if(user.role =='school-admin'){
        if(!params.school_vls_id) throw 'school_vls_id is required'
        whereCodition.school_id = params.school_vls_id
      
    }else{
      throw 'unauthorised user'
    }

    //status and month check
    whereCodition.paid_status = 'paid'
    whereCodition.month = currentMonth
    
    let paid = await Invoice.sum('net_amount', {
      where : whereCodition
    })

    whereCodition.paid_status = 'unpaid'
    let unpaid = await Invoice.sum('net_amount', {
      where : whereCodition
    })

    delete whereCodition.paid_status
    let total = await Invoice.sum('net_amount', {
      where : whereCodition
    })

    let finalData =  { total,  paid , unpaid}

    return { success: true, message: "Fee report", data:finalData }
}



/**
 * API for dashboard Invoces And Transaction
 */
async function dashboardInvocesAndTransaction(params, user){
  if(!params.branch_vls_id) throw 'branch_vls_id is required'
  let whereCodition = {}
  let studentIds = []

  if(user.role =='student'){
    studentIds.push(user.userVlsId)
  }else if(user.role =='guardian'){
      studentIds = await Student.findAll({
          where : { parent_vls_id : user.userVlsId,
                    branch_vls_id : params.branch_vls_id
                  },
          attributes: ['student_vls_id']

        }).then(students => students.map( student => student.student_vls_id));
        whereCodition.student_id = { [Op.in] : studentIds }
  }
  whereCodition.branch_id = params.branch_vls_id
  whereCodition.paid_status = 'unpaid'
  
  let invoices = await Invoice.findAll({
    where : whereCodition,
    include: [{ 
                model:Student,
                as:'student'
              },{ 
                model:Classes,
                as:'class'
             }]
  })

  whereCodition.paid_status = 'paid'
  let invoiceIds = await Invoice.findAll({
        where : whereCodition,
        attributes: ['id']
  }).then(invoices => invoices.map( invoice => invoice.id));
  
  let transactions = await Transaction.findAll({
    where : {invoice_id :{ [Op.in] : invoiceIds }}
  })
  
  return { success: true, message: "Dashboard invoice & transaction", data:{invoices, transactions} }
};



/**
 * API for dashboard Invoces And Transaction
 */
async function dashboardForAdminPrincipal(params, user){
  let whereCodition = {transaction_status : 'SUCCESS'}
  let limit         = 10
  let orderBy       = 'desc';

  if(user.role == 'principal' || user.role == 'branch-admin'){
      if(!params.branch_vls_id) throw 'branch_vls_id is required'
      whereCodition.branch_id = params.branch_vls_id
  }else if(user.role == 'school-admin'){
      if(!params.school_vls_id) throw 'school_vls_id is required'
      whereCodition.school_id = params.school_vls_id
  }
  if(params.size)
      limit = parseInt(params.size)

  let transactions = await Transaction.findAll({
    limit : limit,
    order: [
             ['id', orderBy]
           ],
    include: [{ 
                model:Invoice,
                as:'invoice',
                include: [{ 
                    model:Student,
                    as:'student'
                  },{ 
                    model:Classes,
                    as:'class'
                 }]
              }]    
  })
  
  return { success: true, message: "Dashboard invoice & transaction", data: transactions }
};