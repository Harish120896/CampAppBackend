var express = require('express');
var passport = require('passport');
var geocoder = require('geocoder');
var Camp = require('../models/campDetails');
require('../controllers/loginController')(passport);



var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', passport.authenticate('local-login'),
    function(req, res) {
        if (req.user) {
            res.json({ "message": "success"});
        } else { res.send(401); }
    });

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/success', // redirect to the secure profile section
    failureRedirect: '/failure', // redirect back to the signup page if there is an error
}));

router.post('/register',function(req, res, next){
	var address = req.body.address;
	geocoder.geocode(address, function ( err, data ) {
		var lat = parseFloat(data.results[0].geometry.location.lat);
		var lng = parseFloat(data.results[0].geometry.location.lng);
		req.body.location = [lat,lng];
  		Camp.create(req.body,function(err, job){
		if(err) throw err;
		res.json({"message":"success", "latitude" : lat+"", "longitude" : lng+"" ,"address":address,"salary":job.salary});
	});
	});
});

router.get('/getallcamps',function(req, res, next){
	Camp.find({}).exec(function (err, job) {
		res.json(job);
	})
});
router.get('/removeallcamps',function(req, res, next){
	Camp.remove({}).exec(function (err) {
		if(err) throw err;
		res.json({"success":"deleted all jobs"});
	})
});

router.get('/getbylocation/:lat/:lon',function(req, res, next){
  var lat = parseFloat(req.params.lat);
  var lon = parseFloat(req.params.lon);
  Camp.find({location: {$near:[ lat , lon ],
       $maxDistance: 5}}, function(err, result){
        res.json(result);
    });   
});  

module.exports = router;