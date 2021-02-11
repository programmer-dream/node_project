require('rootpath')();
const express = require('express');
const app = express();

//socket code
var http = require("http").Server(app);
var io = require("socket.io")(http);
//socket code
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('./app/helper/jwt');
const errorHandler = require('./app/helper/error-handler');
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
// app.use(jwt());
let createChatId
// const db = require("./app/models");
// db.sequelize.sync();
app.get("/",function(req, res){
	//res.send('landing page');
	res.sendFile(__dirname + "/index.html");
});
//socket code
io.on("connection", function (socket) {
  console.log("connected");
  //function one
  socket.on("join_chat", (data) => {
  	let currentUserID = "1"
  	let currentUserRole = "employee"
  	currentUser  = currentUserID+currentUserRole
  	let chatWith = data.id+data.role
  	
    //console.log('in room');
    //let Newuser = joinUser(socket.id, data.username,data.roomName)
    //io.to(Newuser.roomname).emit('send data' , {username : Newuser.username,roomname : Newuser.roomname, id : socket.id})
   // io.to(socket.id).emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
   //socket.emit('send_chat' , {id : socket.id ,user_id : data.id, role :  data.role});
   
    //thisRoom = Newuser.roomname;

    //console.log(Newuser);
    createChatId = currentUser+chatWith
    //console.log(createChatId)
    socket.join(createChatId);

  });

  



  //functon two
  socket.on("chat_message", (data) => {
  	//console.log(data)
    io.to(createChatId).emit("chat_message", {data:data,id : socket.id});
  });



  //functon three
  // socket.on("disconnect", () => {
  //   //const user = removeUser(socket.id);

  //   //console.log(user);

  //   //if(user) {
  //     console.log('user has left');
  //   //}

  //   //console.log("disconnected");

  // });

});
//socket code
// api routes
app.use('/chat', require('./app/routes/chat.routes'));


// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3007;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});