const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const token = jwt.sign({
    connectionId: 'c2d70bb0-90d7-465f-aeef-5159a04ef171',
}, process.env.TOKEN);

console.log(token);