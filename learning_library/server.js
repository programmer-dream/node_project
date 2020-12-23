require('rootpath')();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('./app/helper/jwt');
const errorHandler = require('./app/helper/error-handler');
require('dotenv').config()

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(express.static(path.join(__dirname, 'uploads')));

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use JWT auth to secure the api
app.use(jwt());

// const db = require("./app/models");
// db.sequelize.sync();
app.get("/",function(req, res){
	res.send('landing page');
});

// api routes

app.use('/learningLibrary/comment', require('./app/routes/LibraryComment.routes'));
app.use('/learningLibrary', require('./app/routes/learningLibrary.routes'));
app.use('/learningLibrary/ratings', require('./app/routes/ratings.routes'));
app.use('/learningLibrary/likes', require('./app/routes/likes.routes'));

// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});