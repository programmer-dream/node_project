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
app.use('/community', require('./app/routes/community.routes'));
app.use('/community/comment', require('./app/routes/comment.routes'));
app.use('/community/ratings', require('./app/routes/ratings.routes'));
app.use('/community/likes', require('./app/routes/likes.routes'));


// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});