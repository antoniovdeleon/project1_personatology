//require mongoose
var mongoose = require('mongoose'),
//creating db model Schema
Schema = mongoose.Schema;
Comment = require('./comment');

var profileSchema = new Schema({
	type: {type:String, default: "", required: true},
	name: { type:String, default: "", required: true},
	age: {type:String, default: "", required: true},
	hobbies: {type:String, default: "", required: true},	
	careerAspire: {type:String, default: "", required: true},
	jobs: {type:String, default: "", required: true},
	weakness: {type:String, default: "", required: true},
	comments: [Comment.schema]
});

//saving the Schema to var Band and exporting
var Profile = mongoose.model('profiles', profileSchema);
module.exports = Profile;