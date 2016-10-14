var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Owner = require('./owners');

var PetSchema = new Schema({
	name: String,
	type: String,
	age: String,
	interested: {
		type: Number,
		default: 0
	},
	vaccination: String,
	fixed: String,
	gender: String,
	picture: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'Owner'
	},
	description: String
});

var Pet = mongoose.model('Pet', PetSchema);

module.exports = Pet;
