require('rootpath')();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('../helpers/jwt');
const errorHandler = require('../helpers/error-handler');

const jwtPackage = require('jsonwebtoken');
const config = require("../config/env.js");
const helper = require("./app/helper");
const upload  = helper.upload;
const secret = config.secret;
const { check } = require('express-validator');

const assignmentController = require("./app/controllers/assignment.controller");
const authController = require("../vls/app/controllers/auth.controller");

require('dotenv').config()

const app = express();
//socket code
var http = require("http").Server(app);
var io = require("socket.io")(http,{
  path: '/assignment/socket.io',
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
  
});

// create assignment  
app.post("/assignment/create/",[
  upload.fields([{
        name:'file',maxCount:1
    }]),
    check('assignment_completion_date','assignment_completion_date field is required.').not().isEmpty(),
    check('assignment_type','assignment_type field is required.').not().isEmpty(),
    check('assignment_level','assignment_level field is required.').not().isEmpty(),
    check('total_marks','total_marks field is required.').not().isEmpty(),
    check('assignment_class_id','assignment_class_id field is required.').not().isEmpty(),
    check('title','title field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('subject_code','subject_code field is required.').not().isEmpty()
  ],async function(req, res){
   assignmentController.create(req)
          .then((assignment) => {
            if(assignment){
              //create event
              //io.sockets.emit('getNotificaion', { event :'assignment_created' });
              //create event
              res.json(assignment)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating assignment' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update assignment  
app.put("/assignment/update/:id",[
  upload.fields([{
        name:'file',maxCount:1
    }]),
    check('assignment_completion_date','assignment_completion_date field is required.').not().isEmpty(),
    check('assignment_type','assignment_type field is required.').not().isEmpty(),
    check('assignment_level','assignment_level field is required.').not().isEmpty(),
    check('total_marks','total_marks field is required.').not().isEmpty(),
    check('title','title field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('subject_code','subject_code field is required.').not().isEmpty()
  ],async function(req, res){
   assignmentController.update(req)
          .then((assignment) => {
            if(assignment){
              //create event
              io.sockets.emit('getNotificaion', { event :'assignment_updated' });
              //create event
              res.json(assignment)
            }else{
              res.status(400).json({ status: "error", message: 'Error while updating assignment' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// assign to student   
app.put("/assignment/assignToStudents/:id",async function(req, res){
   assignmentController.assignToStudents(req)
          .then((assignment) => {
            if(assignment){
              //create event
              io.sockets.emit('getNotificaion', { event :'assignment_assign' });
              //create event
              res.json(assignment)
            }else{
              res.status(400).json({ status: "error", message: 'Error while asign assignment' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// assign to student   
app.put("/assignment/changeAssignmentStatus/:student_assignment_id",async function(req, res){
   assignmentController.changeAssignmentStatus(req.params, req.user, req.body)
          .then((assignment) => {
            if(assignment){
              //create event
              io.sockets.emit('getNotificaion', { event :'assignment_changeStatus' });
              //create event
              res.json(assignment)
            }else{
              res.status(400).json({ status: "error", message: 'Error while change assignment status' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

app.put("/assignment/releaseAssignment",[
    check('is_released','is_released field is required.').not().isEmpty(),
    check('assignment_id','assignment_id field is required.').not().isEmpty()
    ],async function(req, res){
   assignmentController.releaseAssignment(req.body, req.user)
          .then((assignment) => {
            if(assignment){
              //create event
              io.sockets.emit('getNotificaion', { event :'assignment_published' });
              //create event
              res.json(assignment)
            }else{
              res.status(400).json({ status: "error", message: 'Error while updating assignment' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// api routes
app.use('/assignment', require('./app/routes/assignment.routes'));



// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3006;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});