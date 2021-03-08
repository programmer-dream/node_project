require('rootpath')();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('./app/helper/jwt');
const errorHandler = require('./app/helper/error-handler');

const jwtPackage = require('jsonwebtoken');
const config = require("../config/env.js");
const helper = require("./app/helper");
const upload  = helper.upload;
const secret = config.secret;
const { check } = require('express-validator');

const queryController = require("./app/controllers/query.controller");
const authController = require("../vls/app/controllers/auth.controller");
require('dotenv').config()

const app = express();

//socket code
var http = require("http").Server(app);
var io = require("socket.io")(http,{
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

// create query  
app.post("/query/create",[
  check('subject_code','subject_code field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('student_vls_id','Student_vls_id field is required.').not().isEmpty(),
    check('school_vls_id','School_vls_id field is required.').not().isEmpty()
  ],async function(req, res){
   queryController.create(req)
          .then((query) => {
            if(query){
              //create event
              io.sockets.emit('getNotificaion', { event :'query_created' });
              //create event
              res.json(query)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating query' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update query  
app.put("/query/update/:id",[
  check('subject_code','subject_code field is required.').not().isEmpty(),
    check('topic','Topic field is required.').not().isEmpty(),
    check('description','Description field is required.').not().isEmpty(),
    check('branch_vls_id','Branch_vls_id field is required.').not().isEmpty(),
    check('student_vls_id','Student_vls_id field is required.').not().isEmpty(),
    check('school_vls_id','School_vls_id field is required.').not().isEmpty()
  ],async function(req, res){
   queryController.update(req)
          .then((query) => {
            if(query){
              //create event
              io.sockets.emit('getNotificaion', { event :'query_updated' });
              //create event
              res.json(query)
            }else{
              res.status(400).json({ status: "error", message: 'Error while updating query' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update query  
app.put("/query/statusUpdate/:id",async function(req, res){
   queryController.statusUpdate(req.params.id , req.user, req.body)
          .then((query) => {
            if(query){
              //create event
              io.sockets.emit('getNotificaion', { event :'query_updatedStatus' });
              //create event
              res.json(query)
            }else{
              res.status(400).json({ status: "error", message: 'Error while updating query status' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update query  
app.delete("/query/delete/:id",async function(req, res){
   queryController.deleteQuery(req.params.id, req.user)
          .then((query) => {
            if(query){
              //create event
              //io.sockets.emit('getNotificaion', { event :'query_deleted' });
              //create event
              res.json(query)
            }else{
              res.status(400).json({ status: "error", message: 'Error while deleting query' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// response query  
app.post("/query/response",async function(req, res){
   queryController.queryResponse(req.body, req.user)
          .then((query) => {
            if(query){
              //create event
              io.sockets.emit('getNotificaion', { event :'query_answered' });
              //create event
              res.json(query)
            }else{
              res.status(400).json({ status: "error", message: 'Error while answer on query' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// api routes
app.use('/query', require('./app/routes/query.routes'));
app.use('/query/comment', require('./app/routes/comment.routes'));
app.use('/query/ratings', require('./app/routes/ratings.routes'));
app.use('/query/likes', require('./app/routes/likes.routes'));

// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});