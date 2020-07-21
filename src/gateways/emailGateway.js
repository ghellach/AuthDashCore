const sendGrid = require("@sendgrid/mail");
const nodemailer = require('nodemailer');
const render = require('../functions/templateRender');
const codeGen = require('../functions/verificationCodes');

async function emailConfimation (res, user, cluster, errorParser, use) {
    const emailProfile = cluster.emailProfile;
    let verifSet = false;
    if(cluster.verifyEmail || use !== "emailConfirmation") {
        verifSet = true
        // mark user as not verified
        user.active = 9;

        // generate unique verification code
        const verificationCode = await codeGen(user, cluster.verificationCodeValidityTime, use);

        // fetch cluster name for that specific language
        let fromname = "";
        cluster.names.forEach(name => {
            if(name.lang == user.lang) fromname = name.value;
        })

        // get correct template
        const templates = cluster.templates;
        let view;
        templates.forEach(template => {
            if(template.name === use) view = template 
        });

        // get correct language version of that template
        let toRender;
        view.content.forEach(one => {
            if (one.lang === user.lang) toRender = one.value;
        })

        // render html to be sent
        const html = render(
            toRender, 
            {
                firstName: user.firstName, 
                lastName: user.lastName, 
                verificationCode: verificationCode
            }
        );


        // checks which email provider to use
        if(emailProfile) {
            try {
                mailSender(
                    emailProfile.service,
                    user.email, 
                    emailProfile.credentials.from, 
                    fromname,
                    "email verification", 
                    html,
                    html,
                    emailProfile.credentials.apiKey
                )
            }catch(err){
                console.log(err);
                return errorParser(res, 500);
            }
            
        }else {
            return errorParser(res, 500);
        }
        
    }

    

    user.save();

    let message;
    use !== "emailConfirmation" ? message = 'user with email '+user.email+' has been created successfully !' : message = "code sent successfully !";
    return res.json({
        status: 200,
        message,
        verificationCodeSent: verifSet
    }); 
}

const mailSender = (service, to, from, fromname, subject, text, html, apiKey) => {
    
    
    if(service === "1") {
        try {
            // push email
            sendGrid.setApiKey(apiKey);
            const msg = { to:to, from: fromname + " <" + from + ">",subject: subject, text: text, html: html};
            sendGrid.send(msg);
        }catch{
            return errorParser(res, 500);
        }
        
    }else if(emailProfile.service === "2") {
        
    }
    
}

module.exports = {
    emailConfimation
}