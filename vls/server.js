const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
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

// const db = require("./app/models");
// db.sequelize.sync();
app.get("/",function(req, res){
	res.send('landing page');
});

require("./app/routes/branch.routes")(app);
require("./app/routes/school.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/student.routes')(app);
require('./app/routes/faculty.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});