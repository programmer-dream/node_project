require('rootpath')();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('helpers/jwt');
const errorHandler = require('helpers/error-handler');
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
app.use('/auth', require('./app/routes/auth.routes'));

require("./app/routes/branch.routes")(app);
require("./app/routes/school.routes")(app);
require('./app/routes/student.routes')(app);
require('./app/routes/faculty.routes')(app);
require('./app/routes/parent.routes')(app);

// global error handler
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});