const mongoose = require("mongoose");
//eventually mongoose.Types.ObjectId, for user
const textFileSchema = new mongoose.Schema({
    name: String,
    content: String,
    user: Number,
    
})

const TextFileModel = mongoose.model("textFile", textFileSchema);


module.exports = TextFileModel;