const express = require("express");
const router = express.Router();
const path = require('path');
const TextFileModel = require("../models/text-file.cjs");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config({path: path.resolve(__dirname, '..','.env')});

let MONGODB;
if (process.argv[2])
    MONGODB = process.env.DEV_DB;
else
    MONGODB = process.env.MONGODB;
 
//should this be async?
function authenticateToken(req,res,next){
    try{
        jwt.verify(req.body.token, process.env.SECRET_KEY, {algorithms:["HS256"]});
    }
    catch(err){
        console.log(err);
        res.status(401).send("Bad Token, log in again");
    }
    next();
}

async function saveToDatabase(req, res, next){



    const sampleText = new TextFileModel({
        name: req.body.name,
        content: req.body.content,
        user: req.body.user,
    });
    
    try {
        await mongoose.connect(MONGODB);
    }
    catch (err) {
        console.log(err);
    }

    try{

        let result =  await TextFileModel.findOne({$and: [
            {name: req.body.name}, {user: req.body.user}
        ]}).then(
            async (result)=>{
                if(result == null){
                    //make new entry
                    try{
                        let newDoc = await sampleText.save();
                        res.locals.id = newDoc._id;

                    }
                     catch(err){
                        console.log(err);
                    }
                }
                else{
                    //update Entry
                    result.content = sampleText.content;
                    try{
                        await result.save();
                        res.locals.id = result._id;
                    }
                    catch(err){
                        console.log(err);
                    }
                }
            }
        ).catch((err)=>{
            console.log(err);
        });
        
    }
    catch(err){
        console.log(err);
    }


    next();

}

//to much responsibility but i am tired
async function retrieveTextFiles(req, res, next){
    let results;
    try{
        jwt.verify(req.query.token, process.env.SECRET_KEY, {algorithms:["HS256"]});
    }
    catch(err){
        console.log(err);
        res.status(401).send("Bad Token, log in again");
    }

    try{
        await mongoose.connect(MONGODB)
        
    }
    catch(err){
        console.log(err);
    }

    try{
        results = await TextFileModel.find({user: req.query.userId});
    }
    catch(err){
        console.log(err);
    }
    res.locals.files = results;
    next();
}

async function getFileById(req,res,next){
    let result;
    try{
        jwt.verify(req.query.token, process.env.SECRET_KEY, {algorithms:["HS256"]});
    }
    catch(err){
        console.log(err);
        res.status(401).send("Bad Token, log in again");
    }
    try{
        await mongoose.connect(MONGODB)
        
    }
    catch(err){
        console.log(err);
    }
    try{
        result = await TextFileModel.findById(req.params.fileId);
    }
    catch(err){
        console.log(err);
    }

    res.locals.file = result;
    next();
}

async function verifyAndDeleteTextFile(req,res,next){
  
    try{
        jwt.verify(req.query.token, process.env.SECRET_KEY, {algorithms:["HS256"]});
    }
    catch(err){
        console.log(err);
        res.status(401).send("Bad Token, log in again");
    }

    try{
        await TextFileModel.deleteOne({$and:[{name:req.query.name}, {user: req.query.user}]});
    }
    catch(err){
        console.log(err);
    }
    next();
}

router.post('/',express.json());
router.post('/',authenticateToken);
router.post('/',saveToDatabase);
router.post('/',(req,res)=>{
    res.status(200).send(res.locals.id);
})

router.get("/:fileId", express.json());
router.get("/:fileId",getFileById);
router.get("/:fileId", (req,res)=>{
    res.status(200).send(res.locals.file)
});

router.get("/", express.json());
router.get("/", retrieveTextFiles);
router.get("/", (req,res)=>{

    res.status(200).send(res.locals.files);
});


router.delete("/", express.json());
router.delete("/", verifyAndDeleteTextFile);
router.delete("/", (req,res)=>{
    res.status(200).send();
});

module.exports = router;