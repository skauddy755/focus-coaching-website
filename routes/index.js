var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash");

var webKeys = require("../config/keys");

var	User 			= require("../models/User"),
	Material 		= require("../models/Material");

var testRoutes 		= require("./index");

var router = express.Router({mergeParams: true});

//========================================================================
router.get("/", function(req, res){
    res.redirect("/home");
});
//------------------------------------------------------------------------
router.get("/home", function(req, res){
    res.render("index.ejs");
});
//=========================================================================
router.get("/register", function(req, res){
    
});
//=========================================================================
router.get("/login", function(req, res){
    res.render("login.ejs");
});
//-------------------------------------------------------------------------
router.post("/login", passport.authenticate("local", {
	//successRedirect: "/dashboard",
	failureRedirect: "/login"
}) , function(req, res){
	User.find({username: req.user.username}, function(err, items){
		//console.log(items);
		let item = items[0];
		//console.log(req.body);
		if(req.body.userType === item.userType) res.redirect("/dashboard");
		else res.redirect("/login");
	})
	console.log("Okay..Logged in ...!!");
});
//-------------------------------------------------------------------------
router.get("/logout", function(req, res){
	req.logout();
	//req.flash("success", "Successfully Logged you out...!!!");
	res.redirect("/home");
});
//=========================================================================
router.get("/dashboard", isLoggedIn, function(req, res){
	let type = req.user.userType;
	//console.log(req.user);
	let page = "dashboard.ejs";
	let maps = {user: req.user, classes: webKeys.CLASSES};
	if(type===webKeys.USERTYPES.ADMIN) page = "dashboardAlphaHash.ejs";
	else if(type===webKeys.USERTYPES.FACULTY) page = "dashboardAlpha.ejs";
	//console.log(page);
	res.render(page, maps);
});
//=========================================================================
//+++++++++++++++++++++  MIDDLEWARE  +++++++++++++++++++++++++++++++++++++++++++++++
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) next();
	else
		res.redirect("/login");
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;