var express = require('express');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var Sighting = require('../models/sighting');
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

router.get('/',function(req,res){
      res.render('upload');
  });

router.post('/api/photo',passport.authenticate('local'),function(req,res){
    console.log("req: ",req);
    var taxonId = 101656;
    var path = req.files.userPhoto.path;
    var newSighting = new Sighting({user:req.user._id, taxonId:taxonId, imagePath:path});
    newSighting.save(function(err,sighting){
		res.send("success");
	});
});


router.post('/report', passport.authenticate('local'), function(req, res) {
	var taxon = req.body.taxon;
	var image
});


module.exports = router;