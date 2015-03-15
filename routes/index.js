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
	console.log(date);
	if(!date || date.getDate() != new Date().getDate()){
	console.log("asdasd");
		var obj = require('../beatuifulData.json', 'utf8');
		var random = parseInt(Math.random()*obj.length);
		var choosen = obj[random];
		
		var strings = choosen.location.split(",");
		var lat = strings[0].substring(1); 
		SetRT90WGS84();
		var lng = strings[1].substring(2).split(" ")[0];
		var xy = {x: parseInt(lng), y: parseInt(lat)};
		var ll = {};
		var latlng = XYtoLatLong(xy,ll);
		
		console.log(xy);
		console.log(ll);
		choosen.lng = ll.Long;
		choosen.lat = ll.Lat;
		req.user.animalOfDay = choosen;
		req.user.lastUpdatedAnimal = new Date();
		
		req.user.save(function(err,user){
			if(err){
				console.log(err);
			}else{
				res.redirect('/');
			}
		});
	}else{
	res.redirect('/');
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


var LL = { Lat:60 , Long:15 }; /* used to return value in function RT90ToLatLong */
var XY = { x:6600000, y:1500000 }; /* dito in LatLongToRT90 */
var x0,y0,k0,a,f1,lamda0; /* Ellipsoid params */
var f,n,e2,an,ak, d1,d2,A1,B1, A2,B2,b1,b2; /*,b3;*/ /*basic dervied coefficients */

function SetSWEREF99WGS84() {/* Params for SWEREF99 WGS84 (Lantmäteriet standard TM, ellipsoid GRS80) */
   x0 = 0;                 /* false northing */
   y0 = 500000;            /* false easting */
   k0 = 0.9996;            /* enlargment factor */
   a  = 6378137.0          /* half major ellipsoid axis, Ellipsoid GRS80*/
   f1 = 298.257222101;     /* 1/f, f=(a-b)/a */
   lamda0 = 15.0 * Math.PI /180 ; /* radians, 15 degrees E */
   CompProjCoeffs();
}

function SetRT90Bessel() {/* Parameters for RT90 Bessel*/
   x0 = 0;                /* false northing */
   y0 = 1500000;          /* false easting */
   k0 = 1.0;              /* enlargment factor */
   a  = 6377397.155       /* half major ellipsoid axis */
   f1 = 299.1528128;      /* 1/f, f=(a-b)/a */
   lamda0 = 17.564753086 * Math.PI /200 ; /* (obs nygrader /200), radians 2.5 gon V Stockholm observatorium*/
                                        /* i vanliga grader, 15°48'29".8 öst Greenwich*/
   CompProjCoeffs();
}
function SetRT90WGS84() { /* Params for RT90 WGS84 (Lantmäteriet approx. SWEREF 99) */
   x0 = -667.711;         /* false northing */
   y0 = 1500064.274;      /* false easting */
   k0 = 1.00000561024;    /* enlargment factor */
   a  = 6378137.0         /* half major ellipsoid axis */
   f1 = 298.257222101;    /* 1/f, f=(a-b)/a */
   lamda0 = 15.806284529 * Math.PI /180 ; /* radians, close to 2.5 gon V Stockholm observatorium */
   CompProjCoeffs();
}
function CompProjCoeffs() {/* compute some basic coefficients */
   f  = 1/f1
   n  = f/(2-f);
   e2 = f*(2-f);
   /* first and second order terms in series, errors < 1 meter: */
   an = a/(1+n)*( 1+n*n/4 ); /*+n*n*n*n/64); */
   ak = k0*an;
   /* coeff for RT90-x,y to lat,long */
   d1 = n/2 - n*n*2/3  ; 
   d2 = n*n/48  ;
   A1 = e2 + e2*e2  ; 
   B1 = -1/6*( 7*e2*e2 );
   /* coeff for lat,long to RT90-x,y */
   A2 = e2 ;
   B2 = 1/6*(5*e2*e2);   /* - e2*e2*e2);*/
   b1 = n/2 - n*n*2/3;   /* +5/16*n*n*n;*/
   b2 = 13/48*n*n;       /* -3/5*n*n*n; */
   /* b3 = 61/240*n*n*n; */
}
function XYtoLatLong( XY, LL) { /* output fi=latitude, dlambda=lat-lat0 */
    xi = (XY.x-x0)/ak;   yi = (XY.y-y0)/ak;
    /* comp hyperbolic functions */
    var e2y = Math.exp(2*yi);       var e4y = e2y*e2y;  
    var cosh2y = (e2y + 1/e2y)/2;   var cosh4y = (e4y + 1/e4y)/2;
    var sinh2y = (e2y - 1/e2y)/2;   var sinh4y = (e4y - 1/e4y)/2;
    /* comp adjusted xi,yi */
    xi1 = xi - d1*Math.sin(2*xi)*cosh2y - d2*Math.sin(4*xi)*cosh4y; 
    yi1 = yi - d1*Math.cos(2*xi)*sinh2y - d2*Math.cos(4*xi)*sinh4y;
    /*TEST alert('nord=' + XY.x + ' ost=' + XY.y +'\n'
         +'ak='+ak +' e2='+e2 +'\n'
         +'d1='+d1 +' d2='+d2 +'\n'
         +'A1='+A1 +' B1='+B1 +'\n' 
         +'xi1=' + xi1 + ' yi1=' + yi1);  */
    /* comp hyperbolics for yi */
    var eyi=Math.exp(yi1); var coshyi=(eyi+1/eyi)/2; var sinhyi=(eyi-1/eyi)/2;
    fi0 = Math.asin( Math.sin(xi1)/coshyi );
    dlamda = Math.atan( sinhyi /Math.cos(xi1) );
    /* transform isometric latitude to lat */ 
    var sinfi0=Math.sin(fi0);   var sin2fi0=sinfi0*sinfi0;
    fi = fi0 + sinfi0*Math.cos(fi0)*( A1 + B1*sin2fi0 );
    lamda = dlamda + lamda0;
    LL.Lat  = fi * 180 / Math.PI;
    LL.Long = lamda * 180 / Math.PI;
}
function atanh(y){ 
     x = 0.5*Math.log( (1+y)/(1-y) ); return x;
}
function LatLongtoXY(LL,XY) { 
   /* Input LL.lat,LL.long in decimal degrees, Output XY.x, XY.y */
    fi = LL.Lat * Math.PI / 180;
    lamda = LL.Long * Math.PI / 180;
    dlamda = lamda - lamda0;
    /* transform latitude to isometric lat */ 
    var sinfi=Math.sin(fi);   var sin2fi=sinfi*sinfi;
    fi0 = fi - sinfi*Math.cos(fi)*( A2 + B2*sin2fi );
    xi = Math.atan( Math.tan(fi0)/Math.cos(dlamda) );
    yi = atanh( Math.cos(fi0)*Math.sin(dlamda) );
    /* comp hyperbolic functions */
    var e2y = Math.exp(2*yi);       var e4y = e2y*e2y;  
    var cosh2y = (e2y + 1/e2y)/2;   var cosh4y = (e4y + 1/e4y)/2;
    var sinh2y = (e2y - 1/e2y)/2;   var sinh4y = (e4y - 1/e4y)/2;
    /* var sinh6y = (e4y*e2y - 1/(e4y*e2y) )/2;*/
    /* comp adjusted xi,yi */
    xi1 = xi + b1*Math.sin(2*xi)*cosh2y + b2*Math.sin(4*xi)*cosh4y; 
    yi1 = yi + b1*Math.cos(2*xi)*sinh2y + b2*Math.cos(4*xi)*sinh4y;
             /*+ b3*Math.cos(6*xi)*sinh6y;*/
    /*TEST alert('Lat=' + LL.Lat + ' Long=' + LL.Long +'\n'
         +'ak='+ak +' e2='+e2 +'\n'
         +'b1='+b1 +' b2='+b2 +'\n'
         +'A2='+A2 +' B2='+B2 +'\n' 
         +'xi1=' + xi1 + ' yi1=' + yi1);    */
    /* Comp output x,y , FIX -0.3 = 3 dm */
    XY.x = xi1*ak + x0 -0.3;    XY.x = Math.round(XY.x*10)/10;
    XY.y = yi1*ak + y0 ;    XY.y = Math.round(XY.y*10)/10;
}
   function DegToDM(deg) {
      deg = Math.round(deg*500000)/500000;
      dr = Math.floor(deg);
      m = (deg-dr)*100*0.6; 
      m = Math.round(m*1000000)/1000000;
      mstr=m.toString(); 
      if (mstr[0]=='.') mstr = '0'+mstr;
      dm = ''+ dr.toString() +': '+ mstr;
      /* TEST alert('deg='+deg +' dr='+dr +' mr='+mr +' sr='+sr +'\n'
             +'DD:MM:SS=' + dms  ); */
      return dm;
   }
   function DMToDeg(DM) { /* DM=DD:M.mmm */
      DMarray = DM.split(':');
      if (DMarray[0].length > 2) DMarray = DM.split(' ');
      D = eval(DMarray[0]);
      M = eval(DMarray[1]);
      deg = D + M/60;
      return deg;
   }
   function DegToDMS(deg) {
      deg = Math.round(deg*500000)/500000;
      dr = Math.floor(deg);
      m = (deg-dr)*100*0.6; 
      mr = Math.floor(m);
      s = (m-mr) *100*0.6;
      sr = Math.round(s*100)/100; 
      dms = ''+ dr.toString() +':'+ mr.toString()+':'+sr.toString();
      return dms;
   }
   function DMSToDeg(D,M,S) {
      deg = D + M/60 + S/3600;
      return deg;
   }
   
module.exports = router;
