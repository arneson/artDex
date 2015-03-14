var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sighting = new Schema({
    user: {type:Number, ref:'Account'},
    taxonId: String,
    imagePath: String,
    sightingDate:{type:Date, default:Date.now}
});


module.exports = mongoose.model('sightings', Sighting);