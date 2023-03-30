import mongoose, { Mongoose } from "mongoose";

const textFileSchema = new mongoose.Schema({
    name: String,
    content: String,
    user: Number,
    //eventually mongoose.Types.ObjectId,
})

const TextFileModel = mongoose.model("Text File", textFileSchema);

export {TextFileModel};