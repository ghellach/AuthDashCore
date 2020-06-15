const sendGrid = require("@sendgrid/mail");
const nodemailer = require('nodemailer');
const render = require('../functions/templateRender');

async function emailConfimation (res, user, cluster, errorParser) {
    const emailProfile = cluster.emailProfile;

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
    const html = render(toRender, {firstName: "Achraf Ghellach"});


    // checks which email provider to use
    if(emailProfile) {
        if(emailProfile.service === "1") {
            try {
                // push email
                sendGridMailer(
                    user.email, 
                    emailProfile.credentials.from, 
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

    user.save();
    return res.json({
        status: 200,
        message: 'user with email '+user.email+' has been created successfully !',
    }); 
}

const sendGridMailer = (to, from, subject, text, html, apiKey) => {
    sendGrid.setApiKey(apiKey);
    
    const msg = { to:to, from: from, subject: subject, text: text, html: html};
    console.log(msg)
    sendGrid.send(msg);
    console.log(sendGrid)
}

module.exports = {
    emailConfimation
}