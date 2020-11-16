const express = require("express");
const router = express.Router();
const passport = require('passport');

// @desc Auth with Google
// @route GET /auth/google
router.get('/google', passport.authenticate("google", {
    scope: ["profile", "email"]
  }));

// @desc Google Auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google'), // complete the authenticate using the google strategy
  (err, req, res, next) => { // custom error handler to catch any errors, such as TokenError
    if (err.name === 'TokenError') {
     console.log(err);
     res.redirect('/auth/google'); // redirect them back to the login page
    } else {
     // Handle other errors here
    }
  },
  (req, res) => { // On success, redirect back to '/'
    res.redirect('/dashboard');
  }
);

// @desc Logout user
// @route /auth/logout

router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
});

module.exports = router;