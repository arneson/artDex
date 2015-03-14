var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sighting = new Schema({
    user: Schema.ObjectId,
    taxonId: String,
    imagePath: String,
    sightingDate:{type:Date, default:Date.now},
    location: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} }
});


module.exports = mongoose.model('sightings', Sighting);