const express = require("express");
const router = express.Router();
const path = require('path');
const TextFileModel = require("../models/text-file.cjs");
const mongoose = require("mongoose");
require('dotenv').config({path: path.resolve(__dirname, '..','.env')});




async function saveToDatabase(req, res, next){
    const sampleText = new TextFileModel({
        name: req.body.name,
        content: req.body.content,
        user: req.body.user,
    });
    
    try {
        await mongoose.connect(process.env.MONGODB);
    }
    catch (err) {
        console.log(err);
    }
    await sampleText.save();

    next();

}

async function retrieveTextFiles(req, res, next){
    try{
        await mongoose.connect(process.env.MONGODB)
        .then( async()=>{
            const results = await TextFileModel.find();
            console.log(results);
        });
    }
    catch(err){
        console.log(err);
    }

    next();
}

router.post('/',express.json());
router.post('/',saveToDatabase);
router.post('/',(req,res)=>{
    console.log("in \* post response");
    res.send("updated DB!");
})

router.get("/", (req,res)=>{
    res.send("wew lad");
})

module.exports = router;