const Employee = require('../model/Employee');

async function updatePassword(req,res,next){

	try{


		if(!req.body.empid || !req.body.password){
			return res.json({
				'error':true,
				'message':'please provide necessary details'
			})
		}
		let user = await Employee.findOneAndUpdate({empid:req.body.empid},{password:req.body.password,isnewUser:false},{new:true});
		if(user){
			return res.json({
					'error':false,
					'message':'password updated',
					'data':user
			})
		}

	}catch(err){
		console.log(err);
		res.send('error occured');
	}
}


module.exports = {
	updatePassword
}