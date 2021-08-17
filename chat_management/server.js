require('rootpath')();
const express = require('express');
const app = express();

//socket code
var http = require("http").Server(app);
var io = require("socket.io")(http,{
  path: '/chat/socket.io',
  cors: {
    origin: '*',
  }
});
//socket code
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwtPackage = require('jsonwebtoken');
const jwt = require('../helpers/jwt');
const errorHandler = require('../helpers/error-handler');
const chatController = require("./app/controllers/chat.controller");
const config = require("../config/env.js");
const authController = require("../vls/app/controllers/auth.controller");
const schoolController = require("../school_management/app/controllers/school.controller");
const helper = require("./app/helper");
const upload  = helper.upload;
const secret = config.secret;
require('dotenv').config()


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

let createChatId
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
  io.sockets.emit('chat-list-response', { users });

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
    io.sockets.emit('chat-list-response', { users });
  })
  //read messages
  client.on('readMessage', async function (data) {

    let body = {
        chatIds :[ data.messageId ]
      }

    await chatController.readMessages(body)

    const user = findUser(data.userId)
    if (user) {
      user.socketId.map(socketId => {
        socket.broadcast.to(socketId).emit('seenMessage', {seen: true});
      })
    }
  });

});

// Create chat route
app.post("/chat/create",[
  upload.fields([{
        name:'file',maxCount:1
    }])
  ],async function(req, res){
    let reciverUserId       = req.body.receiver_user_vls_id
    let reciverUsertype     = req.body.receiver_type
    let reciverUserDetails  = await chatController.chatUserDetails(reciverUserId, reciverUsertype)
    chatController.create(req)
          .then((chat) => {
            if(chat){
              const user = findUser(reciverUserDetails.user_name)
              if (user) {
                user.socketId.map(socketId => {
                  io.to(socketId).emit('receivedMessageObject', chat);
                })
              }
              res.json(chat)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating chat' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// api routes
app.use('/chat', require('./app/routes/chat.routes'));
//let testing = 'testing'
// Create chat route
app.get("/chat/school/dasboardCount",async function(req, res){
    schoolController.dasboardCount(req.query, req.user, users)
          .then((counts) => {
            if(counts){
              
              res.json(counts)
            }else{
              res.status(400).json({ status: "error", message: 'Error while getting counts' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});
// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3007;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});