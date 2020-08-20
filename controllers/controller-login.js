const jwt = require('jsonwebtoken');
const Employee = require('../model/Employee');
async function loginUser(req,res,next){

	try{
			// console.log('body',req.body);
			if(!req.body.empId || !req.body.password || !req.body.device_id){
				return res.json({
					'error':true,
					'message':' details not provided '
				})
			}
			const employee = await Employee.findOne({empId:req.body.empId});
			if(employee){
				// console.log(employee);
				if(employee.isBlocked != true){
					if(employee.password === req.body.password){
						if(employee.device_id == req.body.device_id){
							//generate the JWT token
							let token = jwt.sign({empId:employee.empId}, 'secret_string', { expiresIn: '10h' });
							token = `Bearer ${token}`
							return res.json({
								'error':false,
								token:token,
								data:employee,
							})

						}else{
							let flag = false;
							let uuidList = await Employee.find({});
							console.log(uuidList);
							uuidList.forEach(user=>{
								if(user.device_id === req.body.device_id)
								{
									flag =true;
								}
							})

							if(flag == true){
								//block the employee
								let blockedUser = await Employee.findOneAndUpdate({empId:req.body.empId},{isBlocked:true},{new:true});
								res.json({
									'error':true,
									'message':'employee blocked contact manager'
								})
							}else{
								return res.json({
									'error':true,
									'message':'un-authorized device'
								})
							}
						}
					}else{
						return res.json({
							'error':true,
							'message':'incorrect password provided'
						})
					}
				}else{
					return res.json({
						'error':true,
						'message':'employee not allowed to login'
					});
				}
			}else{
				return res.json({
					'error':true,
					'message':'empid not found'
				})
			}

	}catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'user login failed'
		});
	}
}


async function profile(req,res,next){

	try{
		const record = await Employee.findOne({empId:req.params.id});
		// console.log(record);
		if(record){
			res.json({
				'error':false,
				'data':record
			})
		}else{
			res.json({
				'error':true,
				'message':'employee record not found'
			})
		}

	}catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'profile data cannot be fetched'
		})
	}


}



module.exports = {
	loginUser,profile
}