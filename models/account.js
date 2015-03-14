var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Badge = require('./badges');
var Sighting = require('./sighting');

var Account = new Schema({
    username: String,
    password: String,
	animalOfDay: String,
	lastUpdatedAnimal: Date,
	xp: {type : Number,default : 0},
	level: {type : Number,default : 1},
	badges: [Badge.schema],
	sightings :[Sighting.schema]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);