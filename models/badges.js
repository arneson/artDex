var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Badge = new Schema({
	text: String,
	criteria: {prop :String,  theVal : Number},
	imageUrl:String
});

module.exports = mongoose.model('Badge', Badge);
module.exports.schema = Badge;