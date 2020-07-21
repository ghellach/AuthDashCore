const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: "../config/config.env"});

console.log(process.env.JWTSECRET);

const token = jwt.sign({
    connectionId: process.argv[2],
}, process.env.CLIENTTOKEN);

console.log(token);