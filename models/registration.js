var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sighting = new Schema({
    animal: Schema.id,
    latinName: String,
    locations
});


module.exports = mongoose.model('sighting', Sighting);