const mongoose 				= require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new mongoose.Schema({
	username: {
		type: String,
	},
	password: {
		type: String,
	},
	passwordConfirmation: String
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);