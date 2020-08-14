const mongoose = require("mongoose");

const hardwareSchema = mongoose.Schema({
    name:
    {
        type:String,
        required:true
    }
  });

var Hardware=module.exports=mongoose.model('Hardware',hardwareSchema);

//get Hardware
module.exports.getHardware=function(callback,limit){
    Hardware.find(callback).limit(limit);
};

//add Hardware
module.exports.addHardware=function(hardware,callback){
    Hardware.create(hardware,callback);
};