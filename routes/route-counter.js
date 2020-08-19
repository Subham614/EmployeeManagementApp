const router = require('express').Router();
const Counter = require('../model/Counter');

router.post('/api/counter',async (req,res,next)=>{

	try{
		let counterInitial = new Counter({
			value:'product_id',
			sequence:0
		});

		let result = await counterInitial.save();
		if(result){
			res.json({
				'error':false,
				'data':result
			})
		}else{
			res.json({
				'error':true,
				'message':'some error occured',
			})
		}

	}catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'counter not posted'
		})
	}
})


router.get('/api/counter',async (req,res,next)=>{

	try{
			let results = await Counter.find({});
			if(results){
				res.json({
					'error':false,
					'data':results
				})
			}

	}catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'unable to fetch counter details '
		})
	}


})

router.put('/api/counter',async (req,res,next)=>{
	try{

		let currentCounter = await Counter.findOneAndUpdate({value:'product_id'},{$inc:{sequence:1}},{new:true});
		if(currentCounter){
			return res.json({
				'error':false,
				'data':currentCounter,
			})
		}else{
			return res.json({
			'error':true,
			'message':'counter not updated'
		})

		}

	}catch(err){
		console.log(err);
		res.json({
			'error':true,
			'message':'counter not updated'
		})
	}
})




module.exports = router 