const  userSchema  = require("../schemas/user");
const mongoose = require("mongoose");

const User = mongoose.model("User", userSchema);

module.exports = User;