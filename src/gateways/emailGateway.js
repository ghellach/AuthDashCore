const sendGrid = require("@sendgrid/mail");
const nodemailer = require('nodemailer');
const render = require('../functions/templateRender');
const codeGen = require('../functions/verificationCodes');

async function emailConfimation (res, user, cluster, errorParser) {
    const emailProfile = cluster.emailProfile;
    if(cluster.verifyEmail) {
        // mark user as not verified
        user.active = 9;

        // generate unique verification code
        const verificationCode = await codeGen(user, cluster.verificationCodeValidityTime);

        // fetch cluster name for that specific language
        let fromname = "";
        cluster.names.forEach(name => {
            if(name.lang == user.lang) fromname = name.value;
        })

        // get correct template
        const templates = cluster.templates;
        let view;
        templates.forEach(template => {
            if(template.name === "emailConfirmation") view = template 
        });

        // get correct language version of that template
        let toRender;
        view.content.forEach(one => {
            if (one.lang === user.lang) toRender = one.value;
        })

        // render html to be sent
        const html = render(toRender, {firstName: "Achraf Ghellach", verificationCode: verificationCode});


        // checks which email provider to use
        if(emailProfile) {
            if(emailProfile.service === "1") {
                try {
                    // push email
                    sendGridMailer(
                        user.email, 
                        emailProfile.credentials.from, 
                        fromname,
                        "email verification", 
                        html,
                        html,
                        emailProfile.credentials.apiKey
                    )
                }catch{
                    return errorParser(res, 500);
                }
                
            }else if(emailProfile.service === "2") {
                try {
                    // let transporter = nodemailer.createTransport({
                    //     host: "smtp.ethereal.email",
                    //     port: 587,
                    //     secure: false, // true for 465, false for other ports
                    //     auth: {
                    //       user: testAccount.user, // generated ethereal user
                    //       pass: testAccount.pass, // generated ethereal password
                    //     },
                    // });
                    
                    //   // send mail with defined transport object
                    // let info = await transporter.sendMail({
                    // from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    // to: "bar@example.com, baz@example.com", // list of receivers
                    // subject: "Hello ✔", // Subject line
                    // text: "Hello world?", // plain text body
                    // html: "<b>Hello world?</b>", // html body
                    // });
                
                    // console.log("Message sent: %s", info.messageId);
                    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                
                    // // Preview only available when sending through an Ethereal account
                    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                }catch{
                    return errorParser(res, 500);
                }
            }
        }
        
    }

    

    user.save();
    return res.json({
        status: 200,
        message: 'user with email '+user.email+' has been created successfully !',
        verificationCodeSent: true
    }); 
}

const sendGridMailer = (to, from, fromname, subject, text, html, apiKey) => {
    sendGrid.setApiKey(apiKey);
    
    const msg = { to:to, from: fromname + " <" + from + ">",subject: subject, text: text, html: html};
    sendGrid.send(msg);
}

module.exports = {
    emailConfimation
}