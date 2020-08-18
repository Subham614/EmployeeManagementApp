var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const connectDB=require('./DB/Connection');
const upload=require('./services/file-upload');
const singleUpload=upload.single('image');

const PORT = process.env.PORT || 3000;

Employee=require('./model/Employee');
Hardware=require('./model/Hardware');
Designation=require('./model/Designation');
Manager=require('./model/Manager');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//connect to mongo
//to run type nodemon only

// mongoose.connect("mongodb://localhost/EmployeeManagement");
// var db=mongoose.connection;
/*connectDB();*/

// upload the image

app.post('/image-upload', function(req, res) {

    singleUpload(req, res, function(err) {
      if (err) {
        return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
      }
      return res.json({'imageUrl': req.file.location});
    });
  });
  
//add employess
app.post('/api/employees', (req, res) => {
    var employee = req.body;
    Employee.addEmp(employee, (err, employees) => {
        if(err){
            throw err;
        }
        res.json(employees);
    });
});

//get employees
app.get('/api/employees',function(req,res){
    Employee.getEmp(function(err,employees){
        if(err){
            throw err;
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

// app.listen(3000, function(){
//     // connectDB();
//     console.log("Express server is running on port 3000!");
// });

mongoose.connect("mongodb+srv://adminUser:adminUser@cluster0.eeo7b.mongodb.net/<dbname>?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('db connected...');
    app.listen(PORT,()=>console.log(`Listening on port ${PORT}`));
})