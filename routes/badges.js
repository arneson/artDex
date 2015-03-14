var express = require('express');
var router = express.Router();
var Badges = require('../models/badges');

/* GET badges listing. */
router.get('/', function(req, res, next) {
	Badges.find({},function(err,badges){
		if(err) console.log(err);
		var badgesWStatus = [];
		if(req.user){
			for(var i =0;i< badges.length;i++){
				var has = false;
				for(var j = 0; j<req.user.badges.length;j++){
					if(badges[i]._id.toString()==req.user.badges[j]._id.toString()){
						has = true;
						break;
					}
				}
				badgesWStatus.push({badge:badges[i], has:has});
			}
		}
		else{
			for(var j=0; j<badges.length;j++){
				badgesWStatus.push({badge:badges[j], has:false});
			}
		}

		console.log("bdg: ",badgesWStatus);
		res.render('badges',{badges:badgesWStatus});
	});
});

module.exports = router;