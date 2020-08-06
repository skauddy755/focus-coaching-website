var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    localMongoose   = require("passport-local-mongoose"),
    upload          = require("express-fileupload"),
    fs              = require("fs");

var webKeys     = require("./config/keys"),
    seedDB      = require("./config/seedDB");

var testRoutes       = require("./routes/testRoutes.js"),
    indexRoutes      = require("./routes/index.js"),
    membersRoutes    = require("./routes/membersRoutes.js"),
    studentsRoutes   = require("./routes/studentsRoutes.js"),
    materialsRoutes   = require("./routes/materialsRoutes.js");

var User        = require("./models/User.js"),
    Material    = require("./models/Material.js"),
    Param       = require("./models/Param.js");

mongoose.connect("mongodb://localhost/focusData_3",{useUnifiedTopology:true, useNewUrlParser:true});

var app = new express();
app.use(upload());
app.use(express.static("public"));
// app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true, useNewUrlParser:true}));



//=====================================================
//-----------PASSPORT CONFIG.--------------------------
app.use(require("express-session")({
	secret: "Rusty is still the cutest DOG...",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	// res.locals.success = req.flash("success");
	// res.locals.error = req.flash("error");
	next();
});
//======================================================

app.use(indexRoutes);
app.use(membersRoutes);
app.use(studentsRoutes);
app.use(materialsRoutes);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++  TEST-CODE  ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// mongoose.connect("mongodb://localhost/focusData_1",{useUnifiedTopology:true, useNewUrlParser:true});
// var x = new User({name:"Sandeep", data:{fatherName: "Achimtya Kumar Auddy", school: "DNS", class: 9}});
// var y = new User({name:"Amit", data:{des: "ADMIN"}});

// //x.save();
// //y.save();

// User.findByIdAndUpdate("5f1351468527d697f615db1b", {name:"Sandeep", data: {fatherName: "Achintya Auddy", school:"DAV", class: 10}}, function(err, item){
//     console.log(item);
//     User.find({}, function(err, arr){
//         console.log(arr);
//     }); 
// });
// ++++++++++++++ DEDUCTIONS: ++++++++++++++++
// For Mixed Schema Type, the update feature of auto selection doesn't work..
// And the item in the callback of findByIdAndUpdate() is the instance of the data before UPDATE

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// seedDB.seedADMIN();
// seedDB.seedStudents();
// seedDB.seedMembers();
// seedDB.seedMaterials();
// seedDB.initParams();
// seedDB.deleteAllUsers();
// seedDB.showUsers();
// seedDB.showMaterials();
// seedDB.showParams();
// User.deleteMany({userType: webKeys.USERTYPES.STUDENT}, function(err, items){
    // if(err)console.log(err);
    // else console.log(items);
// });
// Material.deleteOne({_id: "5f16be303d5b867c9c3e898b"}, function(err, item){
    // if(err)console.log(err);
    // else console.log(item);
// });
// Param.deleteOne({_id: "5f172fe81c6c288c9a894d7a"}, function(err, item){
    // if(err)console.log(err);
    // else console.log(item);
// });
// const str = " putttt ;PhysiCS;  chemistry;; ;  bioloGY  ; MAT_IU;;";
// seedDB.pushTags(seedDB.segmentTags(str));

app.listen(3000, "localhost", function(){
    console.log("Server is running at PORT: 3000");
});
//5f173d712241834e786e98fa