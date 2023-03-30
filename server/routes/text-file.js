const express = require('express');
const router = express.Router();


async function saveToDatabase(req, res, next){
    const mongoDB = "mongodb://127.0.0.1:27017/text-files";
    const sampleText = new TextFileModel({
        name: "firstFile.txt",
        content: "Here is my first text file!",
        user: "Kurt Johan Voigtritter"
    });
    
    try {
        await mongoose.connect(mongoDB);
    }
    catch (err) {
        alert("databse is f'd :(");
    }
    await sampleText.save();

    next();

}


router.use(saveToDatabase);

router.post("*",(req,res)=>{
    res.send("updated DB!");
})