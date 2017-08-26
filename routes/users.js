var express = require('express');
var passport = require('passport');
var geocoder = require('geocoder');
require('../controllers/loginController')(passport);


var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', passport.authenticate('local-login'),
    function(req, res) {
        if (req.user) {
            res.json({ "message": "success", "position": req.user.position });
        } else { res.send(401); }
    });

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/success', // redirect to the secure profile section
    failureRedirect: '/failure', // redirect back to the signup page if there is an error
}));


module.exports = router;