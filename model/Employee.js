const mongoose=require("mongoose");

const employeeSchema=mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        empid:{
            type:String,
            required:true
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
        joining_date:{
            type:Date,
            required:true
        },
        designation_id: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Designation"
            }
          ],
        manager_id: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Manager"
            }
          ],
        hardware_id: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Hardware"
            }
          ],
        UUID:{
            type:String,
            required:true
        },
        isnewUser:{
            type:Boolean
        },
        isBlocked:{
            type:Boolean,
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
