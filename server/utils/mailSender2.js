const nodemailer = require("nodemailer");

const mailSender2 = async (email2,email, title, content) => {
    console.log("hiii")
    // console.log( process.env.MAIL_USER);
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
          
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: `${email}`,
                to:`${email2}`,
                subject: `${title}`,
                html: `${content}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender2;