require('rootpath')();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('../helpers/jwt');
const errorHandler = require('../helpers/error-handler');
const communityCommentController = require("./app/controllers/community_comment.controller");
const communityController = require("./app/controllers/community.controller");
const authController = require("../vls/app/controllers/auth.controller");
const jwtPackage = require('jsonwebtoken');
require('dotenv').config()
const helper = require("./app/helper");
const upload  = helper.upload;
const config = require("../config/env.js");
const secret = config.secret;
const app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http,{
  path: '/community/socket.io',
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

io.on("connection", async function (client) {
  console.log("connected");
  let token = client.handshake.query.token
  console.log(token, 'token')
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
        socketId: client.id
      })
  }
  //send user online user list
  io.sockets.emit('chat-list-response', { users });

  client.on('disconnect', function (data) {
    users = users.filter(user => user.socketId !== client.id)
    //send user online user list
    io.sockets.emit('chat-list-response', { users });
  })

  client.on('joinRoom', function(data) {
      const communityId = data.communityId
      client.join("communityGroup_"+communityId);
  });

});

// Create community 
app.post("/community/create",[
  upload.fields([{
        name:'file',maxCount:1
    }])
  ],async function(req, res){
   communityController.create(req)
          .then((community) => {
            if(community){
              //create event
              io.sockets.emit('getNotificaion', { event :'community_created' });
              //create event
              res.json(community)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating chat' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// update community 
app.put("/community/update/:id",async function(req, res){
   communityController.update(req)
          .then((community) => {
            if(community){
              //create event
              io.sockets.emit('getNotificaion', { event :'community_updated' });
              //create event
              res.json(community)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating chat' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// add user community 
app.put("/community/:id/addUsers",async function(req, res){
   communityController.addUsers(req.params.id, req.body, req.user )
          .then((community) => {
            if(community){
              //create event
              io.sockets.emit('getNotificaion', { event :'community_addUsers' });
              //create event
              res.json(community)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating chat' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// add addAdmins community 
app.put("/community/:id/addAdmins",async function(req, res){
   communityController.addAdmins(req.params.id, req.body, req.user)
          .then((community) => {
            if(community){
              //create event
              io.sockets.emit('getNotificaion', { event :'community_addAdmins' });
              //create event
              res.json(community)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating chat' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});

// Create chat route
app.post("/community/comment/create",[
  upload.fields([{
        name:'file',maxCount:1
    }])
  ],async function(req, res){

    let community_id = req.body.community_chat_vls_id
    let community = 'communityGroup_'+community_id
    //join community
    communityCommentController.create(req)
          .then((comment) => {
            if(comment){
              io.sockets.in(community).emit('chatMessage', comment);

              res.json(comment)
            }else{
              res.status(400).json({ status: "error", message: 'Error while creating chat' })
            }
          })
          .catch( (err) => {
            console.log(err, "err")
            res.status(400).json({ status: "error", message: "Something went wrong" }) 
          });
});
//socket changes
// api routes
app.use('/community', require('./app/routes/community.routes'));
app.use('/community/comment', require('./app/routes/comment.routes'));
app.use('/community/ratings', require('./app/routes/ratings.routes'));
app.use('/community/likes', require('./app/routes/likes.routes'));


// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3008;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});