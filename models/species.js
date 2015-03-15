var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Animal = new Schema({
	itemName: String,
	location: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },
	imageUrl:String,
	taxonId:String
});

module.exports = mongoose.model('Animal', Animal);
module.exports.schema = Animal;