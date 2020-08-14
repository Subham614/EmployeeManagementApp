const mongoose = require("mongoose");

const designationSchema = mongoose.Schema({
    name: {
            type:String,
            required:true
        }
   
  });
var Designation=module.exports=mongoose.model('Designation',designationSchema);

//get Designation
module.exports.getDesignation=function(callback,limit){
    Designation.find(callback).limit(limit);
};
//add Designation
module.exports.addDesignation=function(designation,callback){
   Designation.create(designation,callback);
};