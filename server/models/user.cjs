const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    userName:String,
    hashedPass:String,
    email:String,
});

const UserModel = mongoose.Model("user", userSchema);

module.exports = UserModel;