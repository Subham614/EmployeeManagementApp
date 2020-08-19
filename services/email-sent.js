require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL || 'donej9138@gmail.com', //your gmail account
        pass: process.env.PASSWORD || 'johntest123' //your gmail password
    }
});
const sendMail=(email,empid,password,callback)=>{
    let mailOptions = {
        from: 'abc@gmail.com', // email sender
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

