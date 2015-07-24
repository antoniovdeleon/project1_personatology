//require mongoose
var mongoose = require('mongoose'),
//creating db model Schema
Schema = mongoose.Schema;
Comment = require('./comment');

var profileSchema = new Schema({
	type: {type:String, default: ""},
	name: { type:String, default: ""},
	age: {type:String, default: ""},
	hobbies: {type:String, default: ""},	
	careerAspire: {type:String, default: ""},
	jobs: {type:String, default: ""},
	weakness: {type:String, default: ""},
	comments: [Comment.schema]
});

//saving the Schema to var Band and exporting
var Profile = mongoose.model('profiles', profileSchema);
module.exports = Profile;