var mongoose 				= require("mongoose"),
	passportLocalMongoose 	= require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    userType: String,
    data: mongoose.Schema.Types.Mixed,
});

UserSchema.plugin(passportLocalMongoose); 
module.exports = mongoose.model("User", UserSchema);