require('rootpath')();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('../helpers/jwt');
const errorHandler = require('../helpers/error-handler');
require('dotenv').config()

const jwtPackage = require('jsonwebtoken');
const config = require("../config/env.js");
const helper = require("./app/helper");
const upload  = helper.upload;
const secret = config.secret;
const { check } = require('express-validator');

const app = express(); 
const feeController = require("./app/controllers/fee.controller");
const authController = require("../vls/app/controllers/auth.controller");
//socket code
var http = require("http").Server(app);
var io = require("socket.io")(http,{
  path: '/fees/socket.io',
  cors: {
    origin: '*',
  }
});
//socket code

var corsOptions = {
  origin: "*"
};

app.use(express.static(path.join(__dirname, 'uploads')));

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

// use JWT auth to secure the api
app.use(jwt());

// const db = require("./app/models");
// db.sequelize.sync();
app.get("/",function(req, res){
	//res.send('landing page');
  res.sendFile(__dirname + "/index.html");
});

let users = []

function findUser(userId) {
  return users.find(user =>  user.userId == userId)

}

//socket code
io.on("connection", async function (client) {
  console.log("connected");
  let token = client.handshake.query.token

  if (!token) {
    console.log("refused a session atempt with token not present");
    client.disconnect(true);
    return;
  }
  let decoded;
  try {
    decoded = jwtPackage.verify(token, secret)
  }
  catch(reason) {
    console.log(reason)
    console.log("refused a session atempt with an invalid token");
    client.disconnect(true);
    return;
  }

  const userDetails = await authController.getById(decoded.userId);
  console.log(userDetails.user_name, "client.user")
  const user = findUser(userDetails.user_name)
  if(decoded.role != "student")
    decoded.role = "employee"

  if(!user){
    users.push({
        userId: userDetails.user_name,
        userVlsId : decoded.userVlsId,
        userType : decoded.role,
        socketId: [client.id]
      })
  }else{
    var userIndex = users.findIndex(user =>  user.userId == userDetails.user_name)
    users[userIndex].socketId.push(client.id)
  }
  //send user online user list

  client.on('disconnect', function (data) {
    users = users.filter(user => {
      var clientId = client.id
      var userSocketIds = user.socketId
      if(userSocketIds.includes(clientId)){
          if(userSocketIds.length > 1){
              const index = userSocketIds.indexOf(clientId);
                if (index > -1) {
                  userSocketIds.splice(index, 1);
                }
                user.socketId = userSocketIds
                return user
            }
        }else{
          return user
        }
    })
    //send user online user list
  })

  // Check Payments
  client.on('checkQrPayments', async function (data) {
    console.log("In Socket")
    let checkQrPaymentsData = await feeController.checkQrPayments(data.invoiceID)

    const user = findUser(data.userId)
    console.log(user, data.userId, 'data.userId')
    if (user) {
      console.log(checkQrPaymentsData, "checkQrPaymentsData")
      user.socketId.map(socketId => {
        io.to(socketId).emit('checkQrPaymentStatus', {paid: checkQrPaymentsData});
      })
    }

  });
  
});


// api routes
app.use('/fee', require('./app/routes/fee.routes'));


// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3018;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});