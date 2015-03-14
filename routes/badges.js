var express = require('express');
var router = express.Router();
var Badges = require('../models/badges');

/* GET badges listing. */
router.get('/', function(req, res, next) {
	Badges.find({},function(err,badges){
		if(err) console.log(err);
		res.render('badges',{badges:badges})
	});
});

module.exports = router;