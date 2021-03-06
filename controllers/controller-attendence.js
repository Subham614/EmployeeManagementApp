const Attendence = require('../model/attendence');
const Employee = require('../model/Employee');
const moment = require('moment');


 function locationMeasure(lat,lon){
 	//base coordinates
	const lat1 = 22.9867569;
	const lon1 = 87.8549755;

	let lat2 = lat;
	let lon2 = lon;

	const R = 6371e3; // metres
	const a1 = lat1 * Math.PI/180; // φ, λ in radians
	const a2 = lat2 * Math.PI/180;
	const l1 = (lat2-lat1) * Math.PI/180;
	const l2 = (lon2-lon1) * Math.PI/180;

	const a = Math.sin(l1/2) * Math.sin(l1/2) +
	          Math.cos(a1) * Math.cos(a2) *
	          Math.sin(l2/2) * Math.sin(l2/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	const d = R * c; // in metres
	// console.log(`distance in meters ${d} meters.`);

	if(d>5000)
		return false;
	else
		return true;

 }


 async function checkIn(req,res,next){
 	try{

 		// get server time
		 let serverTime = new Date();
		 serverTime = serverTime.toLocaleString('en-US',{timeZone:"Asia/Kolkata"});
		 let currentServerTime = (new Date(serverTime)).toString()
		 // return res.json({
		 // 	serverTime:currentServerTime
		 // })

		 // assign the current serverTime to checkIn time 
		 req.body.inTime = currentServerTime;




 		//check whether the empId is a new user or not
		// add code

		let checkinUser = await Employee.findOne({empId:req.body.empId});

		if (checkinUser.isnewUser){
			return res.json({
				'error':'true',
				'message':'new employee didnot changed the temp password'
			})
		}

		 // check whether the location is provided or not 
	 	if(!req.body.lat && !req.body.lon){
	 		return res.json({
	 			'error':true,
	 			'message':'co-ordinates not provided'
	 		})

	 	}
	 		
	 	// check whether the employee is within 500m meters
	 	let isPermitted = locationMeasure(req.body.lat,req.body.lon);
	 	if(isPermitted){
	 	 	// check if employee id is provided or not
		 	if(!req.body.empId){
		 		return res.json({
		 			'error':'true',
		 			'message':'empId not provided'
		 		})
		 	}


		 	//check whether check-in time is provided or not
		 	if(!req.body.inTime){
		 		return res.json({
		 			'error':'true',
		 			'message':'check in time not provided'
		 		})
		 	}

		 	//create a new employee attendence object
	 		const newAttendence = new Attendence({
				empId:req.body.empId,
				inTime :req.body.inTime,
				outTime:req.body.outTime,
				lateInReason:req.body.lateInReason,
				lateInReason:req.body.lateInReason,
				earlyOutReason:'',
				lateIn:false,
				earlyOut:false
			});


	 		// 	newAttendence.inTime = req.body.inTime.split(' ').slice(0,5).join(' ');
				// let today = moment(newAttendence.inTime).format('LT');
				// let todayTime = today.split(':');
				// let currentTime = todayTime[0]
			// time = 10 am

			let today = newAttendence.inTime.toString();
			let todayTime = today.split(' ');
			let currentDateTime = todayTime[4].split(':');
			let currentTime = currentDateTime[0];

			
		

			// return res.json({
			// 	'error':true,
			// 	'inTime':newAttendence.inTime.toString(),
			// 	'today':today,
			// 	'current time':currentTime
			// })


			if(currentTime > 9){
				newAttendence.lateIn = true;
				// check if late entry reason is provided or not
				if(newAttendence.lateInReason==''){
					return res.json({
						'error':true,
						'message':'late entry reason not provided'
					})
				}
			}else{
				newAttendence.lateInReason = 'not late';
				newAttendence.lateIn = false;
			}

			// check whether the user have checkedIn or not
			let today1 = moment().startOf('day');
			let isCheckedin = await Attendence.findOne({
				empId:req.body.empId,
				entryDate:{
					$gte : today1.toDate(),
					$lte : moment(today1).endOf('day').toDate()
				}
			})

			if(isCheckedin){
				return res.json({
					'error':true,
					'message':'employee has already checked in'
				})
			}else{
				// save the attendence object into the database
				newAttendence.save((err,data)=>{
					if(err){
						console.log('attendence not saved in the database');
						res.send('error');
					}
					else{
						res.status(200).json({
							'error':false,
							'data':data
						});
					}
				});
			}

		}// end of is Permitted
		else{
 			res.json({
 				'error':true,
 				'message':'user is not within the permitted limited of 500m range from the office location'
 			})
 		}
 	}
 	catch(err){
 		console.log(err);
 		res.json({
 			'error':true,
 			'message':'check in not done'
 		})
 	}
 }



//get the attendence details for the current day
function attendenceDetails(req,res,next){

		let today = moment().startOf('day');

		Attendence.find({
			empId:req.params.id,
			entryDate:{
				$gte : today.toDate(),
				$lte : moment(today).endOf('day').toDate()
			}
		}).then(results=>{
			res.status(200).send(results);
		}).catch(err=>{
			console.log('error',err);
			res.json(err);
		})	
}

// get the monthly details for an employee
async function monthlyAttendence(req,res,next){

		let begin,last;
		begin = moment().startOf('month').toDate(); // 1st date of the month
		last  = moment().endOf('month').toDate(); // last date of the month

		try{

			let report = await Attendence.find({
				empId:req.params.id,
				entryDate:{
					$gte: begin,
					$lte : last,
				}
			});


			res.send(report);

		}
		catch(err){
			console.log(err);
			res.send('error');
		}
}





async function checkOut(req,res,next){
	try{

			// get server time
			let serverTime = new Date();
			serverTime = serverTime.toLocaleString('en-US',{timeZone:"Asia/Kolkata"});
			let currentServerTime = (new Date(serverTime)).toString()

			// return res.json({
		 	// 		serverTime:currentServerTime
		 	// 	})
		 	req.body.outTime = currentServerTime;




		if(!req.body.empId){
			return res.json({
				'error':true,
				'message':'empId not provided'
			})
		}
		else if(!req.body.outTime)
		{
			return res.json({
				'error':true,
				'message':'check out time not provided'
			})

		}



		let today1 = moment().startOf('day');

			const filter = {
			empId:req.body.empId,
			entryDate:{
				$gte : today1.toDate(),
				$lte : moment(today1).endOf('day').toDate()
				}
			}


			const update = {
				outTime:req.body.outTime,
				earlyOutReason:req.body.earlyOutReason,
			}

			// let today = update.outTime.toString();
			// let todayTime = (today.split(' '));
			// let currentTime = (todayTime[4]).split(':');
			

				// update.outTime = req.body.outTime.split(' ').slice(0,5).join(' ');
				// let today = moment(update.outTime).format('LT');
				// let todayTime = today.split(':');
				// let currentTime = todayTime[0]


			let today = update.outTime.toString();
			let todayTime = today.split(' ');
			let currentDateTime = todayTime[4].split(':');
			let currentTime = currentDateTime[0];


			// return res.json({
			// 	'error':true,
			// 	'inTime':update.outTime.toString(),
			// 	'today':today,
			// 	'current time':currentTime
			// })

			// time = 6pm
			if(currentTime <= 17){
				update.earlyOut=true;
				// check if the early checkout reason is given
				if(!req.body.earlyOutReason){
					return res.json({
						'error':true,
						'message':'early check out not provided'
					})
				}
			}else{
				update.earlyOutReason = 'not early';
				update.earlyOut=false;
			}


			let isCheckedOut = await Attendence.findOne({
				empId:req.body.empId,
				entryDate:{
					$gte : today1.toDate(),
					$lte : moment(today1).endOf('day').toDate()
				}
			})

			if(isCheckedOut.outTime){
				return res.json({
					'error':true,
					'message':'employee has already checked out'
				})
			}
			else{
				let doc = await Attendence.findOneAndUpdate(filter,update,{new:true});
				// console.log(doc.inTime.toString());
				// console.log(doc.outTime.toString());
				res.json({
					'error':false,
					'data': doc
				});				
			}
	}
	catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'check out not done'
		});
	}

}

 module.exports = {
 	checkIn,attendenceDetails,checkOut,monthlyAttendence
 }