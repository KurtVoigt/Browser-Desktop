const mongoose = require("mongoose");
//eventually mongoose.Types.ObjectId, for user
const textFileSchema = new mongoose.Schema({
    name: String,
    content: String,
    user: {type:mongoose.Types.ObjectId, ref:"user"},
    
})

const TextFileModel = mongoose.model("textFile", textFileSchema);


module.exports = TextFileModel;