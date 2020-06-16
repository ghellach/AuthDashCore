const ConfirmationCode = require('../models/ConfirmationCode');
const moment = require('moment');

async function emailConfirmationCode(user, minutes) {
    let code = codeGen();
    const checkDb = await ConfirmationCode.findOne({code: code, use: "emailConfirmation", used: false});
    if(checkDb){
        emailConfirmationCode(user);
    } else {
        const newCode = new ConfirmationCode({
            user: user._id, 
            code: code,
            expiresAt: moment().add(minutes,'minutes').format(),
            use: "emailConfirmation"
        });
        await newCode.save();
        return code;
    }

}

const codeGen = () => {
    let digits = "0123456789";
    let code = '';
    for(let i = 0; i < 8; i++) {
        code += digits[Math.floor(Math.random() * 10)];
    }
    return code;
}

module.exports = emailConfirmationCode
