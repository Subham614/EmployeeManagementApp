require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL || 'abc@gmail.com', //your gmail account
        pass: process.env.PASSWORD || '1234' //your gmail password
    }
});
const sendMail=(email,empid,password,callback)=>{
    let mailOptions = {
        from: 'subhamp614@gmail.com', // email sender
        to: email, // email receiver
        subject:'User registration Done!!',
        text:'Hello User,\n Your verified Employee id is :' + empid + ' \n Your Onetime Passowrd : ' + password,
    }; 
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            //console.log('Error occurs');
            callback(err,null);
        }
        //console.log('Email sent!!!');
        callback(null,data);
    });
}
module.exports=sendMail;

