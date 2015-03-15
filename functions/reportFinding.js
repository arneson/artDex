var express = require('express');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var Sighting = require('../models/sighting');
var Auth = require('./auth');
var Badges = require('../models/badges');
var Animals = require('../models/species');
// var app = express();
// var done=false;


// app.use(multer({ dest: './uploads/',
//  rename: function (fieldname, filename) {
//     return filename+Date.now();
//   },
// onFileUploadStart: function (file) {
//   console.log(file.originalname + ' is starting ...')
// },
// onFileUploadComplete: function (file) {
//   console.log(file.fieldname + ' uploaded to  ' + file.path)
//   done=true;
// }
// }));

// router.post('/api/photo',function(req,res){
// 	//console.log("req: ",req);
//   if(done==true){
//     console.log(req.files);
//     res.end("File uploaded.");
//   }
// });

router.get('/',Auth.loggedIn,function(req,res){
      Animals.find({},function(err,animals){
      	res.render('upload',{animals:animals});
      });
  });

router.post('/api/photo',function(req,res){
	if(req.user){
	    console.log("req: ",req);
	    var taxonId = 101656;
	    var location = {coordinates:[0,0]};
	    var path = req.files.userPhoto.path;
	    var newSighting = new Sighting({user:req.user._id, taxonId:taxonId, imagePath:path,location:location});
	    newSighting.save(function(err,sighting){
	    	req.user.sightings.push(sighting);
	    	if(req.user.animalOfDay==taxonId){
	    		updatePoints(req.user,100,res,req);
	    	}
	    	else{
	    		updatePoints(req.user,5,res,req);
	    	}
		});
	}
	else
		res.redirect(201,'/');
});


function updatePoints(user,points,res,req){
	user.xp = user.xp + points;
	while(user.xp>=user.level*10){
		user.xp = user.xp - user.level*10;
		user.level++;
	}
	updateBadges(user,res,req);
}

function updateBadges(user,res,req){
	Badges.find({},function(err,badges){
		if(err) console.log(err);
		for(var i = 0; i<badges.length;i++){
			if(badges[i].criteria.prop == 'sightings'){
				if(user.sightings.length>=badges[i].criteria.theVal){
					user.badges.push(badges[i]);
				}
			}
		}
		user.save(function(err,user){
			if(err) console.log(err);
			res.redirect('/');
		});

	});
}

module.exports = router;