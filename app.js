const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Application configuration
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
dotenv.config();
mongoose.connect(
    process.env.MONGODB,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log(Date() + " | Connected to MongoDB successfully")
);

// bad request handler
app.use((err, req, res, next) => {
    if(err.status === 400) return res.status(err.status).json({status: 400, message: 'bad request'});

    return next(err);
});

// Where magic happens !
const routes = require('./src/routes/routes');
app.use('/', routes);

app.listen(7000, () => console.log(Date() + " | Web Server up and running"));
