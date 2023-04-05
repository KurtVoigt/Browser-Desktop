const express = require("express");
const router = express.Router();
const path = require('path');
const mongoose = require("mongoose");
const UserModel = require("../models/user.cjs");
const jwt = require('jsonwebtoken');
require('dotenv').config({path: path.resolve(__dirname, '..','.env')});


let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}

const mongoDB = "mongodb://127.0.0.1:27017/users";

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }

async function saveUserToDatabase(req, res, next){
    console.log(crypto.createHash('sha256').update(req.body.password).digest('base64'));
    const newUser = new UserModel({
        userName: req.body.userName,
        hashedPass: crypto.createHash('sha256').update(req.body.password).digest('base64').toString(),
        email: req.body.email,
    });

    //TODO
    try{
        await mongoose.connect(process.env.MONGODB);
    }
    catch(err){
        console.log(err);
    }

    try{
        await newUser.save();
        
    }
    catch(err){
        console.log(err);
    }

    res.locals.user = UserModel.findOne({userName: req.body.userName, email: req.body.email}, );

    //assuming it is now connected and saved
    //generate token

    next();
}

router.post('/', express.json());
router.post("/", saveUserToDatabase);
router.post('/', (req,res)=>{
    //user now saved and in locals, generate token
    const token = jwt.sign({userName: req.body.userName}, process.env.SECRET_KEY, {expiresIn: "4h", algorithm:"HS256"});
    res.status(201).send(token);
});

module.exports = router;
