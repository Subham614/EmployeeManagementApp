const mongoose = require('mongoose');

const CounterSchema = mongoose.Schema({
	value:{
		type:String
	},
	sequence:{
		type:Number
	}
})

module.exports = mongoose.model("counter",CounterSchema);