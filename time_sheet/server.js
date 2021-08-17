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
const authController = require("../vls/app/controllers/auth.controller");
const meetingController = require("./app/controllers/meeting.controller");
const app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http,{
  path: '/time_sheet/socket.io',
  cors: {
    origin: '*',
  }
});

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
//socket changes
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
  //io.sockets.emit('getNotificaion', { event :'test_event' });
  //io.sockets.emit('onlineUser', { users }); 

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
    //io.sockets.emit('onlineUser', { users });
  })
})
// create meeting 
app.post("/meeting/create",[
    check('attendee_vls_id','attendee_vls_id field is required.').not().isEmpty(),
    check('attendee_type','attendee_type field is required.').not().isEmpty(),
    check('meeting_title','meeting_title field is required.').not().isEmpty(),
    check('meeting_description','meeting_description field is required.').not().isEmpty(),
    check('meeting_mode','meeting_mode field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty(),
    check('time','time field is required.').not().isEmpty(),
    check('duration','duration field is required.').not().isEmpty()
    ],async function(req , res){
   meetingController.create(req)
          .then((meeting) => {
            if(meeting){
              //create event
              io.sockets.emit('getNotificaion', { event :'meeting_created' });
              //create event
              res.json(meeting)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating meeting' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update meeting 
app.put("/meeting/update/:id",[
    check('meeting_title','meeting_title field is required.').not().isEmpty(),
    check('meeting_description','meeting_description field is required.').not().isEmpty(),
    check('meeting_mode','meeting_mode field is required.').not().isEmpty(),
    check('date','date field is required.').not().isEmpty(),
    check('time','time field is required.').not().isEmpty(),
    check('duration','duration field is required.').not().isEmpty()
    ],async function(req , res){
   meetingController.update(req)
          .then((meeting) => {
            if(meeting){
              //create event
              io.sockets.emit('getNotificaion', { event :'meeting_updated' });
              //create event
              res.json(meeting)
            }else{
              res.status(400).json({ status: "error", message: 'Error while updating meeting' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update meeting 
app.delete("/meeting/delete/:id",async function(req , res){
   meetingController.deleteMeeting(req.params.id, req.user)
          .then((meeting) => {
            if(meeting){
              //create event
              io.sockets.emit('getNotificaion', { event :'meeting_delete' });
              //create event
              res.json(meeting)
            }else{
              res.status(400).json({ status: "error", message: 'Error while delete meeting' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// attend meeting 
app.put("/meeting/attend/:id",async function(req , res){
   meetingController.attendMeeting(req.params.id, req.body, req.user)
          .then((meeting) => {
            if(meeting){
              //create event
              io.sockets.emit('getNotificaion', { event :'meeting_attend' });
              //create event
              res.json(meeting)
            }else{
              res.status(400).json({ status: "error", message: 'Error while attend meeting' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// api routes
app.use('/timeSheet', require('./app/routes/timeSheet.routes'));
app.use('/meeting', require('./app/routes/meeting.routes'));
app.use('/schedule', require('./app/routes/schedule.routes'));


// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3051;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});