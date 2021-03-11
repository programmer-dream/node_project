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
require('dotenv').config()

const app = express();

var http = require("http").Server(app);

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

// api routes
app.use('/ticket', require('./app/routes/ticket.routes'));


// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3013;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});