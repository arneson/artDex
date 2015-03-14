var express = require('express');
var router = express.Router();
var Badges = require('../models/badges');

/* GET badges listing. */
router.get('/', function(req, res, next) {
	Badges.find({},function(err,badges){
		if(err) console.log(err);
		if(req.user){
			for(var i =0; i<req.user.badges.length;i++){
				for(var j=0; j<badges.length;j++){
					if(badges[j]._id == req.user.badges[i]._id)
						badges[j].has = true;
				}
			}
		}
		res.render('badges',{badges:badges})
	});
});

module.exports = router;