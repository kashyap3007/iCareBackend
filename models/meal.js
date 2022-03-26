const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const {ObjectId} = mongoose.Schema();

var mealSchema = new Schema({
	foodname : {
		type : String,
		trim : true,
		required : true
	},
	calorie : {
		type : Number,
		trim : true,
		required : true
	},
	description : {
		type : String,
		trim : true
	},
	username : {
		type : String,
		trim : true,
	}
	
}, {timestamps : true})

const Meal = model("Meal", mealSchema)

module.exports = Meal;
