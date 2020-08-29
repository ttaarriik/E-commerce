const express = require('express'),
	  { validationResult } = require("express-validator"),
	  { handleErrors } = require("./middleware"),
	  router = express.Router(),
	  Admin = require("../../models/admin"),
	  passport = require("passport"),
	  { requireUsername,
	  	requirePassword,
	   	requirePasswordConfirmation,
	  	requireValidPassword,
	  	requireUsernameExists} = require("./validators");

router.get("/signUp", (req, res) => {
	res.render("admin/auth/signUp");
});

router.post("/signUp",
	[requireUsername, requirePassword, requirePasswordConfirmation],
	handleErrors("admin/auth/signUp"),
	(req, res) => {
	const { username, password, passwordConfirmation} = req.body;
	Admin.register(new Admin({username, passwordConfirmation}), password, (err, admin) => {
		if(err){
			console.log(err);
		}
			passport.authenticate("local")(req, res, () => {
				res.render("admin/products/new");
			})	
	})
});

router.get("/signIn", (req, res) => {
	res.render("admin/auth/signIn");
})

router.post('/signIn', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user){ return res.render("admin/auth/signIn", {error: info.message}) }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/admin/products/new');
    });
  })(req, res, next);
});

router.get("/signOut", (req, res) => {
	req.logout();
	res.redirect("/signIn");
})

module.exports = router;