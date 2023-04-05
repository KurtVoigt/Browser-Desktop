const express = require("express");
const router = express.Router();
const path = require('path');
const mongoose = require("mongoose");
const UserModel = require("../models/user.cjs");
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

let crypto;
try {
    crypto = require('node:crypto');
} catch (err) {
    console.error('crypto support is disabled!');
}

async function lookupUser(req, res, next) {
    const userName = req.body.userName;
    const hashedPass = crypto.createHash('sha256').update(req.body.password).digest('base64').toString();
    let foundUser = null;

    try {
        await mongoose.connect(process.env.MONGODB);
    }
    catch (err) {
        console.log(err);
    }

    try {
        foundUser = await UserModel.findOne({ $and: [{ userName: userName }, { hashedPass: hashedPass }] });

    }
    catch (err) {
        console.log(err);
    }

    res.locals.user = foundUser;

    next();

}


function formResponse(req,res){
    if(res.locals.user){
        //send back a token
        const token = jwt.sign({ userName: req.body.userName }, process.env.SECRET_KEY, { expiresIn: "4h", algorithm: "HS256" });
        res.status(200).send(token);
    }
    else{
        res.status(404).send("user not found");
    }

}


router.post("/", express.json());
router.post("/", lookupUser);
router.post("/", formResponse);

module.exports = router;


