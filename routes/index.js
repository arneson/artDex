var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var fs = require('fs');
var router = express.Router();

function progressbar(user){
    return parseInt( (user.xp / (user.level * 10)) * 100);  
};

router.get('/', function (req, res) {
	if(req.user){
        
		res.render('index', { user : req.user, level : req.user.level, xp : req.user.xp, progressbarwidth: progressbar(req.user),species : 'Älg' , family : 'Hjortdjur', speciesclass : 'Däggdjur', kingdom : 'Djur'});
	}else{
		res.redirect('/login');
	}
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user, species : 'Älg' , family : 'Hjortdjur', speciesclass : 'Däggdjur', kingdom : 'Djur'});
});

router.post('/login', passport.authenticate('local'), function(req, res) {

	var date = req.user.lastUpdatedAnimal;
	if(!date || date.getDate() != new Date().getDate()){
		var obj = require('../beatuifulData.json', 'utf8');
		var random = parseInt(Math.random()*obj.length);
		var choosen = obj[random];
		
		req.user.animalOfDay = choosen;
		req.user.lastUpdatedAnimal = new Date();
		
		req.user.save(function(err,user){
			if(err){
				console.log(err);
			}else{
				res.redirect('/');
			}
		});
	}
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect(201,'/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

function getSebbesIQ(){
    return ['f','i','s','k','m','å','s'].length;
}

module.exports = router;
