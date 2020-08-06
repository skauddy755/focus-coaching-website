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
//------------------------------------------------------------------------
router.post("/students", isLoggedIn, function(req, res){
    let type = req.user.userType;
    let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
    if(flag===false)res.redirect("/");
    else
    {
        User.find({}, function(err, items){
            if(err)
            {
                console.log(err);
                console.log("ERROR IN FINDING: STUDENTs");
            }
            else
            {
                console.log(items);
                let relevantItems = items.filter(function(value){
                    let bool = (value.userType == webKeys.USERTYPES.STUDENT) && (value.data.class == req.body.className);
                    console.log(bool);
                    return bool;
                });
                console.log(req.body.className);
                console.log(relevantItems);
                res.render("students.ejs", {students: relevantItems, classNum: req.body.className});
            }
        });
    }
});
//------------------------------------------------------------------------
router.get("/students/bridge/:className", isLoggedIn, function(req, res){
    let type = req.user.userType;
    let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
    if(flag===false)res.redirect("/");
    else
    {
        User.find({}, function(err, items){
            if(err)
            {
                console.log(err);
                console.log("ERROR IN FINDING: STUDENTs");
            }
            else
            {
                console.log(items);
                let relevantItems = items.filter(function(value){
                    let bool = (value.userType == webKeys.USERTYPES.STUDENT) && (value.data.class == req.params.className);
                    console.log(bool);
                    return bool;
                });
                console.log(req.params.className);
                console.log(relevantItems);
                res.render("students.ejs", {students: relevantItems, classNum: req.params.className});
            }
        });
    }
});
//========================================================================
router.get("/students/new/:className", isLoggedIn, function(req, res){
    let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag) res.render("newStudent.ejs", {classNum: req.params.className});
	else res.redirect("/");
});
//------------------------------------------------------------------------
router.post("/students/new/:className", isLoggedIn, function(req, res){
    console.log("Reached newSt...");
    console.log(req.body);
    let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag)
	{
		let student = req.body;
		var nu = new User({
			username: student.username,
			userType: webKeys.USERTYPES.STUDENT,
			data: student.data
        });
        nu.data.class = req.params.className;
		User.register(nu, student.password, function(err, item){
			if(err)
			{
				console.log(err);
				console.log("ERROR IN REGISTERING STUDENT...!!!");
			}
			else
			{
				console.log(item);
				res.redirect("/students/bridge/"+req.params.className);
			}
		});
	}
	else res.redirect("/");
});
//========================================================================
router.get("/students/edit/:userId", isLoggedIn, function(req, res){
    let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;

	if(flag===false) res.redirect("/");
	else
	{
		User.findById(req.params.userId, function(err, item){
            console.log(item);
			res.render("editStudent.ejs", {student: item});
		});
	}
});
//-------------------------------------------------------------------------
router.post("/students/edit/:userId", isLoggedIn, function(req, res){
	console.log("Came Students here..");
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag)
	{
		let student = req.body;
		
		var nu = new User({
			username: student.username,
			userType: webKeys.USERTYPES.STUDENT,
			data: student.data
		});
		User.deleteOne({_id: req.params.userId}, function(err, itemD){
			if(err)console.log("ERROR IN DELETING EXISTING-USER");
			else
			{
				User.register(nu, student.password || webKeys.DEFAULT_PASSWORD, function(err, item){
					if(err)
					{
						console.log(err);
						console.log("ERROR IN UPDATING STUDENT DETAILS...!!!");
					}
					else
					{
						console.log(item);
						res.redirect("/students/bridge/"+item.data.class);
					}
				});
			}
		});
	}
	else res.redirect("/");
});
//=========================================================================
router.post("/students/remove/:className/:userId", isLoggedIn, function(req, res){
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.ADMIN) ? true : false ;
	if(flag)
	{
		let faculty = req.body;
		User.deleteOne({_id: req.params.userId}, function(err, item){
			if(err)
			{
				console.log(err);
				console.log("ERROR IN DELETING EXISTING-USER");
			}
			else
			{
				console.log(item);
				res.redirect("/students/bridge/"+req.params.className);
			}
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