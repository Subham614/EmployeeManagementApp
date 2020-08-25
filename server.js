const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const upload=require('./services/file-upload');
const singleUpload=upload.single('image');
const sendMail=require('./services/email-sent');
const randomString = require('./services/random');

const PORT = process.env.PORT || 3000;

Employee=require('./model/Employee');
Hardware=require('./model/Hardware');
Designation=require('./model/Designation');
Manager=require('./model/Manager');

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
let Counter = require('./model/Counter');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//connect to mongo
//to run type nodemon only

// mongoose.connect("mongodb://localhost/EmployeeManagement");
// var db=mongoose.connection;


// upload the image
app.post('/image-upload', function(req, res) {

    singleUpload(req, res, function(err) {
      if (err) {
        return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
      }
      return res.json({'imageUrl': req.file.location});
    });
  });
  
//add employess and sent mail
app.post('/api/employees', async (req, res) => {
    let employee = req.body;

    let currentCounter = await Counter.findOneAndUpdate({value:'product_id'},{$inc:{sequence:1}},{new:true});
    if(currentCounter){

        let empId = `zreyas_${currentCounter.sequence}`;
        let password = randomString.makeid();
        //let device_id = `device_${currentCounter.sequence}`;

        employee.empId = empId;
        employee.password = password;
        //employee.device_id = device_id;


        Employee.addEmp(employee, (err, employees) => {
        if(err){
            return res.json({
                'error':true,
                'message':'user registration not successfull'
            });
        }else if(employees){
            sendMail(employees.email,employees.empId,employees.password, function(err,data){
                if(err)
                {
                    return res.json({'message':'Internal Error!'});
                }else{
                    return res.json({
                        'error':false,
                        'message':'email sent!!',
                        data:employees
                    });
                }
            })
        }
        // res.json(employees);
    });

    }

});

//get employees
app.get('/api/employees',function(req,res){
    Employee.getEmp(function(err,employees){
        if(err){
            // throw err;
            res.json({
                'error':true,
                'message':'details not fetched'
            })
        }
        res.json(employees);
    });
});

//add designations
app.post('/api/designations', (req, res) => {
    var designation = req.body;
    Designation.addDesignation(designation, (err, designations) => {
        if(err){
            throw err;
        }
        res.json(designations);
    });
});

// display all designations
app.get('/api/designations',function(req,res){
    Designation.getDesignation(function(err,designations){
        if(err){
            throw err;
        }
        res.json(designations);
    });
});

//add hardwares
app.post('/api/hardwares', (req, res) => {
    var hardware = req.body;
    Hardware.addHardware(hardware, (err, hardwares) => {
        if(err){
            throw err;
        }
        res.json(hardwares);
    });
});

//display all hardwares
app.get('/api/hardwares',function(req,res){
    Hardware.getHardware(function(err,hardwares){
        if(err){
            throw err;
        }
        res.json(hardwares);
    });
});

//add managers
app.post('/api/managers', (req, res) => {
    var manager = req.body;
    Manager.addManager(manager, (err, managers) => {
        if(err){
            throw err;
        }
        res.json(managers);
    });
});

//display all managers
app.get('/api/managers',function(req,res){
    Manager.getManager(function(err,managers){
        if(err){
            throw err;
        }
        res.json(managers);
    });
});

app.get('/',function(req,res){
    res.send("hello");
})

app.use('/api',require('./routes/route-login'));
app.use('/',require('./routes/route-employee'));
app.use('/',require('./routes/route-counter'));
app.use('/attendence',require('./routes/route-attendence'));
app.use('/location',require('./routes/route-location'));


mongoose.connect("mongodb+srv://adminUser:adminUser@cluster0.eeo7b.mongodb.net/employeeManage?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('db connected!!');
    app.listen(PORT,()=>console.log(`Express server is Listening on port: ${PORT}`));
})