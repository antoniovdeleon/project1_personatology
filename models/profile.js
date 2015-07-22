//require mongoose
var mongoose = require('mongoose'),
//creating db model Schema
Schema = mongoose.Schema;
Comment = require('./comment');

var profileSchema = new Schema({
	type: {type:String},
	name: { type:String},
	age: {type:String},
	hobbies: {type:String},	
	careerAspire: {type:String},
	jobs: {type:String},
	weakness: {type:String},
	comments: [Comment.schema]
});

//saving the Schema to var Band and exporting
var Profile = mongoose.model('profiles', profileSchema);
module.exports = Profile;