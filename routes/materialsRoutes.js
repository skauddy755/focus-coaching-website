var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash"),
	upload			= require("express-fileupload"),
	fs				= require("fs");

var webKeys = require("../config/keys"),
	seedDB = require("../config/seedDB");

var	User 			= require("../models/User"),
	Material 		= require("../models/Material"),
	Param 			= require("../models/Param.js");

var testRoutes 		= require("./index");

var router = express.Router({mergeParams: true});

//========================================================================
router.post("/materials", isLoggedIn, function(req, res){
    let type = req.user.userType;
    let flag = (type === webKeys.USERTYPES.STUDENTS) ? false : true ;
    Material.find({class: req.body.className}, function(err, items){
		console.log(items);
		Param.find({}, function(err, its){
			console.log(its[0].searchTags);
			res.render("materials.ejs", {materials: items, editable: flag, searchTags: its[0].searchTags, className: req.body.className, tag: "all Materials..."});
		});
    });
});
//------------------------------------------------------------------------
router.get("/materials/:className", isLoggedIn, function(req, res){
    let type = req.user.userType;
    let flag = (type === webKeys.USERTYPES.STUDENTS) ? false : true ;
    Material.find({class: req.params.className}, function(err, items){
		console.log(items);
		Param.find({}, function(err, its){
			console.log(its[0].searchTags);
			res.render("materials.ejs", {materials: items, editable: flag, searchTags: its[0].searchTags, className: req.params.className, tag: "all Materials..."});
		});
    });
});
//------------------------------------------------------------------------
router.post("/materials/:className", isLoggedIn, function(req, res){
    let type = req.user.userType;
    let flag = (type === webKeys.USERTYPES.STUDENT) ? false : true ;
    Material.find({class: req.params.className}, function(err, items){
		let relevantItems = items.filter(function(value){
			let bool = value.searchParams.some(function(v){
				return (v === req.body.searchParam);
			});
			return bool;
		});
		console.log(relevantItems);
		Param.find({}, function(err, its){
			console.log(its[0].searchTags);
			res.render("materials.ejs", {materials: relevantItems, editable: flag, searchTags: its[0].searchTags, className: req.params.className, tag: req.body.searchParam});
		});
        
    });
});
//========================================================================
router.get("/materials/:className/new", isLoggedIn, function(req, res){
    let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.STUDENT) ? false : true ;
	if(flag) res.render("newMaterial.ejs", {className: req.params.className});
	else res.redirect("/");
});
//------------------------------------------------------------------------
router.post("/materials/:className/new", isLoggedIn, function(req, res){
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.STUDENT) ? false : true ;
	if(flag)
	{
		console.log(req.body);
		console.log(req.files);
		var mf = req.files.myNewFile;
		var filename = mf.name;
		mf.mv('./resources/class_materials/'+filename, function(err) {
			if(err) console.log(err);
			console.log("FileSaved...");
			var mat = new Material({
				fileName: mf.name,
				searchParams: seedDB.segmentTags(req.body.searchParams),
				class: req.params.className,
				desc: req.body.desc,
				date: new Date()
			});
			mat.save(function(err){
				if(err)console.log(err);
				else
				{
					console.log(mat);
					seedDB.pushTags(mat.searchParams);
					res.redirect(`/materials/${req.params.className}`);
				}
			});
		});
	}
	else res.redirect("/");
});
//========================================================================
router.get("/materials/:className/:id", isLoggedIn, function(req, res){
    // let type = req.user.userType;
	// let flag = (type === webKeys.USERTYPES.STUDENT) ? false : true ;
	// if(flag) res.render("materials.ejs", {className: req.params.className});
	// else res.redirect("/");
	Material.findById(req.params.id, function(err, item){
		let filePath = `./resources/class_materials/${item.fileName}`;
		res.download(filePath);
	});
});
//========================================================================
router.post("/materials/:className/:id/remove", isLoggedIn, function(req, res){
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.STUDENT) ? false : true ;
	if(flag)
	{
		Material.findById(req.params.id, function(err, item){
			fs.unlinkSync("./resources/class_materials/"+item.fileName);
			Material.deleteOne({_id: req.params.id}, function(err, mssg){
				if(err) console.log(err);
				else
				{
					console.log(mssg);
					res.redirect("/materials/"+req.params.className);
				}
			});
		});
	}
	else res.redirect("/");
});
//========================================================================
router.get("/materials/:className/:id/edit", isLoggedIn, function(req, res){
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.STUDENT) ? false : true ;
	if(flag)
	{
		Material.findById(req.params.id, function(err, item){
			res.render("editMaterial.ejs", {material: item, className: req.params.className});
		});
	}
	else res.redirect("/");
});
//------------------------------------------------------------------------
router.post("/materials/:className/:id/edit", isLoggedIn, function(req, res){
	let type = req.user.userType;
	let flag = (type === webKeys.USERTYPES.STUDENT) ? false : true ;
	if(flag)
	{
		var obj = {
			desc: req.body.desc,
			searchParams: seedDB.segmentTags(req.body.searchParams),
		};
		Material.findByIdAndUpdate(req.params.id, obj, function(err, item){
			seedDB.pushTags(item.searchParams);
			res.redirect("/materials/"+req.params.className);
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