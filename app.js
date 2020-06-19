const express = require('express');
const dbConnection = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');

// Application configuration
const app = express();
app.use(cors());
app.use("/static", express.static('./static'));
app.use(morgan('dev'));
app.use(express.json());
app.use(bearerToken());
dotenv.config({path: './config/config.env'});
dbConnection();

// Where magic happens !
const routes = require('./src/routes/routes');
app.use('/', routes);

app.listen(7000, () => console.log(Date() + " | Web Server up and running"));
