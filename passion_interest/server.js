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

const passionController = require("./app/controllers/passion.controller");
const authController = require("../vls/app/controllers/auth.controller");

require('dotenv').config()


const app = express(); 

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

// create assignment  
app.post("/blog/create/",[
    check('passion_name','passion_name field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty()
  ],async function(req, res){
   passionController.create(req)
          .then((blog) => {
            if(blog){
              //create event
              io.sockets.emit('getNotificaion', { event :'blog_created' });
              // create event
              res.json(blog)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating blog' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update assignment  
app.put("/blog/update/:id/", async function(req, res){
   passionController.update(req)
          .then((blog) => {
            if(blog){
              //create event
              io.sockets.emit('getNotificaion', { event :'blog_updated' });
              // create event
              res.json(blog)
            }else{
              res.status(400).json({ status: "error", message: 'Error while updating blog' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// delete assignment  
app.delete("/blog/delete/:id", async function(req, res){
   passionController.deletePassion(req.params.id, req.user)
          .then((blog) => {
            if(blog){
              //create event
              io.sockets.emit('getNotificaion', { event :'blog_deleted' });
              // create event
              res.json(blog)
            }else{
              res.status(400).json({ status: "error", message: 'Error while deleting blog' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// api routes
app.use('/blog', require('./app/routes/passion.routes'));
app.use('/blog/comment', require('./app/routes/comment.routes'));


// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3016;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});