const mongoose = require("mongoose");

const managerSchema = mongoose.Schema({
    name: {
            type:String,
            required:true
        }
   
  });
var Manager=module.exports=mongoose.model('Manager',managerSchema);

//get Manager
module.exports.getManager=function(callback,limit){
    Manager.find(callback).limit(limit);
};
//add Manager
module.exports.addManager=function(manager,callback){
    Manager.create(manager,callback);
};