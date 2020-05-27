const nodemailer = require('nodemailer');
//var port = Process.env.PORT;

module.exports = {
    sendMail: async function(token){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: Account.user, // generated ethereal user
                pass: Account.pass, // generated ethereal password
            }
        });
        var verifyUrl = "http://localhost:3000/confirmation/?tok="+token.token+"&email="+token.email+"\n." ;
        let info = await transporter.sendMail({
            from: '"Slabber Services" <noreply@slabber.com>', // sender address
            to: token.email, // list of receivers
            subject: "Email Verification at Slabber", // Subject line
            text: "", // plain text body
            html: "Hello,\n\n"+"Please confirm your account creation request at Slabber, by clicking this link \n" + verifyUrl, //html body
        });
        return info;
    }
}