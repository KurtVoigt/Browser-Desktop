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

let MONGODB;
if (process.argv[2])
    MONGODB = process.env.DEV_DB;
else
    MONGODB = process.env.MONGODB;
    async function saveUserToDatabase(req, res, next) {
        const newUser = new UserModel({
            userName: req.body.userName,
            hashedPass: crypto.createHash('sha256').update(req.body.password).digest('base64').toString(),
            email: req.body.email,
        });

        //TODO
        try {
            await mongoose.connect(MONGODB);
        }
        catch (err) {
            console.log(err);
        }
        //see if username or email is already on the server
        let foundUserName;
        let foundEmail;
        try {
            foundUserName = await UserModel.find({ userName: req.body.userName });

        }
        catch (err) {
            console.log(err);
        }

        try {
            foundEmail = await UserModel.find({ email: req.body.email });
        }
        catch (err) {
            console.log(err);
        }

        if (foundUserName === []) {
            res.status(409).send("userName");
        }
        else if (foundEmail === []) {

            res.status(409).send("email");
        }

        else {
            try {
                await newUser.save();
                res.locals.user = await UserModel.findOne({
                    $and: [{ email: req.body.email },
                    { hashedPass: crypto.createHash('sha256').update(req.body.password).digest('base64').toString() },
                    {
                        userName: req.body.userName,
                    }]
                });
                next();
            }
            catch (err) {
                console.log(err);
            }



        }



    }

router.post('/', express.json());
router.post("/", saveUserToDatabase);
router.post('/', (req, res) => {
    //user now saved and in locals, generate token

    const token = jwt.sign({ userId: res.locals.user.id }, process.env.SECRET_KEY, { expiresIn: "4h", algorithm: "HS256" });
    res.status(201).send(token);
});

module.exports = router;
