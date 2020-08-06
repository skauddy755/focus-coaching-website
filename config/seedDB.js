var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local");

var webKeys     = require("./keys");

var User        = require("../models/User.js"),
    Material    = require("../models/Material.js"),
    Param       = require("../models/Param.js");

//app.use(bodyParser.urlencoded({extended: true, useNewUrlParser:true}));

function seedADMIN()
{
    var admin = new User({
        username: webKeys.ADMIN.USERNAME,
        userType: webKeys.USERTYPES.ADMIN,
        data: {}
    });

    User.find({username: webKeys.ADMIN.USERNAME}, function(err, items){
        if(err) return res.send("Error in REGISTERING ADMIN");
        if(items.length === 0)
        {
            User.register(admin, webKeys.ADMIN.PASSWORD, function(err, item){
                if(err)
                {
                    console.log(err);
                    console.log("ERROR IN SEEDING ADMIN...!!!");
                }
                else
                    console.log(item);
            });
        }
    });
}

function seedStudents()
{
    let i;
    let N = webKeys.CLASSES.length;
    for(i=0; i<N; i++)
    {
        let c = webKeys.CLASSES[i];
        let j;
        for(j=0; j<5; j++)
        {
            var nu = new User({
                username: `St_C${c}_id${j}`,
                userType: webKeys.USERTYPES.STUDENT,
                data: {name: "Noobs_"+c+"_"+j, school: "DAV", class: c, contactS: "8340393937"}
            });
            User.register(nu, "sss", function(err, item){
                if(err)
                {
                    console.log(err);
                    console.log("ERROR IN SEEDING STUDENT...!!!");
                }
                else console.log(item);
            });
        }
    }
}

function seedMembers()
{
    var nu = new User({
        username: "sand",
        userType: webKeys.USERTYPES.FACULTY,
        data: {name: "Sandeep Kumar Auddy",  email: "sandeepkrauddy755@gmail.com", contact: "8340393937"}
    });
    User.register(nu, "755", function(err, item){
        if(err)
        {
            console.log(err);
            console.log("ERROR IN SEEDING FACULTY...!!!");
        }
        else console.log(item);
    });
}
function seedMaterials()
{
    var mat1 = new Material({
        fileName: "9thMat_nlm1",
        searchParams: ["PHYSICS", "NLM"],
        class: webKeys.CLASSES[1],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat1.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
    var mat2 = new Material({
        fileName: "9thMat_nlm2",
        searchParams: ["PHYSICS", "NLM"],
        class: webKeys.CLASSES[1],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat2.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
    var mat3 = new Material({
        fileName: "9thMat_nom1",
        searchParams: ["CHEMISTRY", "NOM"],
        class: webKeys.CLASSES[1],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat3.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
    var mat4 = new Material({
        fileName: "9thMat_nom2",
        searchParams: ["CHEMISTRY", "NOM"],
        class: webKeys.CLASSES[1],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat4.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
    var mat5 = new Material({
        fileName: "9thMat_nom_nlm",
        searchParams: ["PHYSICS", "CHEMISTRY", "NLM", "NOM"],
        class: webKeys.CLASSES[1],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat5.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
    var mat6 = new Material({
        fileName: "10thMat_mag1",
        searchParams: ["PHYSICS", "MAGNETISM"],
        class: webKeys.CLASSES[2],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat6.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
    var mat7 = new Material({
        fileName: "10thMat_mag2",
        searchParams: ["PHYSICS", "MAGNETISM"],
        class: webKeys.CLASSES[2],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat7.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
    var mat8 = new Material({
        fileName: "10thMat_mag_nlm",
        searchParams: ["PHYSICS", "MAGNETISM", "NLM"],
        class: webKeys.CLASSES[2],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat8.save(function(err){
        if(err)console.log(err);
    });

    //--------------------------------------------------
    var mat9 = new Material({
        fileName: "9thMat_nom1",
        searchParams: ["PHYSICS", "CHEMISTRY", "NLM", "NOM"],
        class: webKeys.CLASSES[1],
        desc: "iuy euiry eiwuryewi uryeu ryewu rewui",
        date: new Date()
    });
    mat9.save(function(err){
        if(err)console.log(err);
    });
    //--------------------------------------------------
}

function initParams()
{
    var p = new Param({
        searchTags: []
    });
    webKeys.DEFAULT_TAGS.forEach(function(value){
        p.searchTags.push(value);
    });
    p.save(function(err){
        if(err)console.log(err);
    });
}
function segmentTags(str)
{
    var tags = [];
    var word = "";
    for(let i=0; i<str.length; i++)
    {
        let ch = str.charAt(i);
        let bool = (ch === webKeys.DELIMITER);
        if(bool)
        {
            if(word) tags.push(word);
            word = "";
        }
        else word = word+ch;
    }
    tags = tags.map((value)=> value.trim().toUpperCase());
    tags = tags.filter((value)=>value);
    return tags;
}
function pushTags(newTags)
{
    Param.find({}, function(err, items){
        if(err) console.log(err);
        else
        {
            newTags.forEach((value)=>{
                let bool = items[0].searchTags.every((it)=> !(it===value));
                if(bool) items[0].searchTags.push(value);
            });
            items[0].save(function(err){
                if(err)console.log(err);
            });
        }
    });
}

function deleteAllUsers()
{
    User.deleteMany({}, function(err, items){
        if(err)
        {
            console.log(err);
            console.log("ERROR IN DELETING ALL-USERS");
        }
        else console.log(items);
    });
}

function showUsers()
{
    User.find({}, function(err, items){
        console.log(items);
    });
}
function showMaterials()
{
    Material.find({}, function(err, items){
        console.log(items);
    });
}
function showParams()
{
    Param.find({}, function(err, items){
        console.log(items);
    });
}


module.exports = {
    seedADMIN: seedADMIN,
    seedStudents: seedStudents,
    seedMembers: seedMembers,
    seedMaterials: seedMaterials,
    initParams: initParams,
    deleteAllUsers: deleteAllUsers,
    showUsers: showUsers,
    showMaterials: showMaterials,
    showParams: showParams,
    segmentTags: segmentTags,
    pushTags: pushTags
};