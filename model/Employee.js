const mongoose=require("mongoose");

const employeeSchema=mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        empId:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        dob:{
            type:Date,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        profile_pic:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        phone_no:{
            type:String,
            required:true,
            unique:true
        },
        joining_date:{
            type:Date,
            required:true,
            default:Date.now
        },
        designation:{
          type:String,
        },
        
      manager:{
          type:String,
          required:true
        },
        hardware:{
          type:String,
        },
        device_id:{
            type:String,
            required:true,
            unique:true
        },
        isnewUser:{
            type:Boolean,
            default:true
        },
        isBlocked:{
            type:Boolean,
            default:false
        },
    });
var Employee=module.exports=mongoose.model('Employee',employeeSchema);

//get Emp
module.exports.getEmp=function(callback,limit){
    Employee.find(callback).limit(limit);
};
//add Emp
module.exports.addEmp=function(employee,callback){
  Employee.create(employee,callback);
};
