var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash"),
	upload			= require("express-fileupload"),
	fs				= require("fs");

var webKeys = require("../config/keys");

var	User 			= require("../models/User"),
	Material 		= require("../models/Material");

var testRoutes 		= require("./index");

var router = express.Router({mergeParams: true});

//========================================================================
router.get("/contacts", function(req, res){
	User.find({userType: webKeys.USERTYPES.FACULTY}, function(err, items){
        res.render("members.ejs", {members: items, editable: false});
    });
});
//------------------------------------------------------------------------
router.get("/members", isLoggedIn, function(req, res){
    let type = req.user.userType;
    let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
    User.find({userType: webKeys.USERTYPES.FACULTY}, function(err, items){
        res.render("members.ejs", {members: items, editable: flag});
    });
});
//========================================================================
router.get("/members/new", isLoggedIn, function(req, res){
    let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag) res.render("newMember.ejs");
	else res.redirect("/");
});
//------------------------------------------------------------------------
router.post("/members/new", isLoggedIn, function(req, res){
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag)
	{
		let faculty = req.body;
		console.log(faculty);

		var myFile = req.files.myNewFile;
		var fName = myFile.name;
		var obj = {fileName: fName};

		var nu = new User({
			username: faculty.username,
			userType: webKeys.USERTYPES.FACULTY,
			data: {...faculty, ...obj}
		});

		//nu.data.fileName = fName;

		myFile.mv('./Public/profile_pics/'+fName, function(err) {
			if(err) console.log(err);
			console.log("FileSaved...");
		});
		User.register(nu, faculty.password, function(err, item){
			if(err)
			{
				console.log(err);
				console.log("ERROR IN REGISTERING FACULTY...!!!");
			}
			else
			{
				console.log(item);
				res.redirect("/members");
			}
		});
	}
	else res.redirect("/");
});
//========================================================================
router.get("/members/edit/:userId", isLoggedIn, function(req, res){
    let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;

	if(flag===false) res.redirect("/");
	else
	{
		User.findById(req.params.userId, function(err, item){
			res.render("editMember.ejs", {member: item});
		});
	}
});
//-------------------------------------------------------------------------
router.post("/members/edit/:userId", isLoggedIn, function(req, res){
	console.log("Came here..");
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag)
	{
		let faculty = req.body;
		console.log(faculty);
		
		var nu = new User({
			username: faculty.username,
			userType: webKeys.USERTYPES.FACULTY,
			data: faculty
		});

		User.findById({_id: req.params.userId}, function(err, item){
			
			if(req.files)
			{
				var myFile = req.files.myNewFile;
				var fName = myFile.name;
				nu.data.fileName = fName;
				myFile.mv('./Public/profile_pics/'+fName, function(err) {
					if(err) console.log(err);
					else console.log("FileSaved...");
				});
			}
			else nu.data.fileName = item.data.fileName;

			User.deleteOne({_id: req.params.userId}, function(err, item){
				if(err)console.log("ERROR IN DELETING EXISTING-USER");
				else
				{
					User.register(nu, faculty.password || webKeys.DEFAULT_PASSWORD, function(err, item){
						if(err)
						{
							console.log(err);
							console.log("ERROR IN UPDATING FACULTY DETAILS...!!!");
						}
						else
						{
							console.log(item);
							res.redirect("/members");
						}
					});
				}
			});
		});
	}
	else res.redirect("/");
});
//=========================================================================
router.post("/members/remove/:userId", isLoggedIn, function(req, res){
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag)
	{
		//let faculty = req.body;
		User.findById({_id: req.params.userId}, function(err, item){
			fs.unlinkSync("./Public/profile_pics/"+item.data.fileName);
			User.deleteOne({_id: req.params.userId}, function(err, item){
				if(err)
				{
					console.log(err);
					console.log("ERROR IN DELETING EXISTING-USER");
				}
				else
				{
					console.log(item);
					res.redirect("/members");
				}
			});
		});
	}
	else res.redirect("/");
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