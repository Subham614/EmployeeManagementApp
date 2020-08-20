require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure:false,
    auth: {
        user:'donej9138@gmail.com', //your gmail account
        pass:'johntest123' //your gmail password
    },tls:{
           rejectUnauthorized :false
    }
});
const sendMail=(email,empid,password,callback)=>{
    let mailOptions = {
        from:'donej9138@gmail.com', // email sender
        to: email, // email receiver
        subject:'User registration Done!!',
        text:'Hello User,\n Your verified Employee id is :' + empid + ' \n Your Onetime Passowrd : ' + password,
    }; 
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('error is ',err);
            callback(err,null);
        }

        else{
            console.log('Email sent!!!');
            callback(null,data);
        }
    });
}
module.exports=sendMail;

