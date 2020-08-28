require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const sendMail=require('./services/email-sent');
const randomString = require('./services/random');

const PORT = process.env.PORT || 3000;

Employee=require('./model/Employee');
Hardware=require('./model/Hardware');
Designation=require('./model/Designation');
Manager=require('./model/Manager');
let Counter = require('./model/Counter');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Create new storage instance with Firebase project credentials
const storage = new Storage({
    projectId: 'image-upload-1dd3e',
    keyFilename: './api/services/myprivatekey.json',
  });

  // Create a bucket associated to Firebase storage bucket
const bucket = storage.bucket('gs://image-upload-1dd3e.appspot.com');

// Initiating a memory storage engine to store files as Buffer objects
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
  },
});



// const allowedOrigins = [
//   'capacitor://localhost',
//   'ionic://localhost',
//   'http://localhost',
//   'http://localhost:8080',
//   'http://localhost:8100',
//   'http://localhost:4200'
// ];

// // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Origin not allowed by CORS'));
//     }
//   }
// }

// // Enable preflight requests for all routes
// app.options('*', cors(corsOptions));

app.use(cors());










//connect to mongo
//to run type nodemon only

// mongoose.connect("mongodb://localhost/EmployeeManagement");
// var db=mongoose.connection;


// upload the image

// Upload endpoint to send file to Firebase storage bucket
app.post('/api/image-upload', uploader.single('image'), async (req, res, next) => {
    //console.log(req.body,req.file);
    try 
    {
      if (!req.file) {
        res.status(400).send('Error, could not upload file');
        return;
      }
      let currentCounter = await Counter.findOneAndUpdate({value:'product_id'},{$inc:{sequence:1}},{new:true});
      // Create new blob in the bucket referencing the file
      const blob = bucket.file(req.file.originalname);
  
      // Create writable stream and specifying file mimetype
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
  
      blobWriter.on('error', (err) => next(err));
      blobWriter.on('finish', () => {
      let employee = req.body;
        // Assembling public URL for accessing the file via HTTP
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURI(blob.name)}?alt=media`;

        employee.profile_pic=publicUrl;
        console.log(employee);
       
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









        // Return the file name and its public URL
    //     res
    //       .status(200)
    //       .send({ fileName: req.file.originalname, fileLocation: publicUrl });
    });
  
      // When there is no more data to be consumed from the stream
      blobWriter.end(req.file.buffer);
    } catch (error) {
      res.status(400).send(`Error, could not upload file: ${error}`);
      return;
    }
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