const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const token = jwt.sign({
    connectionId: process.argv[2],
}, 'dSgVkYp3s6v8y/B?E(H+MbQeThWmZq4t');

console.log(token);