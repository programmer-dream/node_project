require('rootpath')();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('../helpers/jwt');
const errorHandler = require('../helpers/error-handler');
require('dotenv').config()

const app = express();

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
	res.send('landing page');
});

// api routes
app.use('/learningLibrary', require('./app/routes/learningLibrary.routes'));
app.use('/learningLibrary/comment', require('./app/routes/libraryComment.routes'));
app.use('/learningLibrary/ratings', require('./app/routes/ratings.routes'));
app.use('/learningLibrary/likes', require('./app/routes/likes.routes'));
app.use('/library/history', require('./app/routes/learningLibraryHistory.routes'));

// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});