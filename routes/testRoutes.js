var express     = require("express"),
    bodyParser  = require("body-parser");

var router = express.Router({mergeParams: true});

router.get("/", function(req, res){
    res.render("index");
});

router.get("/contacts", function(req, res){
    res.render("members");
});

router.get("/login", function(req, res){
    res.render("login");
});

router.get("/dashboard", function(req, res){
    res.render("dashboard.ejs");
});
router.get("/dashboardAlpha", function(req, res){
    res.render("dashboardAlpha.ejs");
});
router.get("/dashboardAlphaHash", function(req, res){
    res.render("dashboardAlphaHash.ejs");
});

router.get("/classMaterials", function(req, res){
    res.render("classMaterials.ejs");
});
router.get("/newMaterial", function(req, res){
    res.render("newMaterial.ejs");
});
router.get("/editMaterial", function(req, res){
    res.render("editMaterial.ejs");
});

router.get("/students", function(req, res){
    res.render("students.ejs");
});
router.get("/newStudent", function(req, res){
    res.render("newStudent.ejs");
});
router.get("/editStudent", function(req, res){
    res.render("editStudent.ejs");
});


router.get("/members", function(req, res){
    res.render("members.ejs");
});
router.get("/newMember", function(req, res){
    res.render("newMember.ejs");
});
router.get("/editMember", function(req, res){
    res.render("editMember.ejs");
});

//Test-Routes...
router.post("/search", function(req, res){
    console.log(req);
});
//================================================

module.exports = router;