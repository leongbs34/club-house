var express = require('express');
var router = express.Router();
const passport = require("passport");
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', messageController.message_details_get);

router.post('/postMessage', checkAuthenticated, messageController.message_create_post);

router.get('/signup', checkNotAuthenticated, userController.user_create_get);

router.post('/signup', checkNotAuthenticated, userController.user_create_post);

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login_form', {title: 'Log In', user: req.user});
})

router.post('/login', checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/membership", checkAuthenticated, (req, res) => {
  res.render('membership_form', {title: 'Join Membership', user: req.user})
});

router.post("/membership", checkAuthenticated ,userController.user_update_membership);

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
      res.redirect("/login");
  }
}

function checkNotAuthenticated(req,res,next){
  if(!req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
      res.redirect("/");
  }
}


module.exports = router;
