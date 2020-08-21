const Employee = require('../model/Employee');

async function updatePassword(req,res,next){

	try{


		if(!req.body.empId || !req.body.password){
			return res.json({
				'error':true,
				'message':'please provide necessary details'
			})
		}
		let user = await Employee.findOneAndUpdate({empId:req.body.empId},{password:req.body.password,isnewUser:false},{new:true});
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


async function getEmployee(req,res,next){
	try{
		let output = await Employee({empId:req.params.id});
		if(output){
			res.json({
				'error':false,
				'data':data
			})
		}else{
			res.json({
			'error':true,
			'message':'details not fetched'
			})

		}

		

	}catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'details not fetched'
		})
	}
}


async function updateEmployee(req,res,next){

	let filter = {
		empId : req.body.empId
	}
	let update = req.body;

	try{
		let updatedData = await Employee.findOneAndUpdate(filter,update,{new:true});

		if(updatedData.empId)
			res.json({
				'error':false,
				'data':updatedData
			})
		else{
			res.json({
				'error':true,
				'message':'Employee details not updated'
			})
		}

	}catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'Employee details not updated'
		})
	}


}

module.exports = {
	updatePassword,getEmployee,updateEmployee
}