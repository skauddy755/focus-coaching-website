var mongoose = require("mongoose");

var MaterialSchema = new mongoose.Schema({
    fileName: String,
    searchParams: [String],
    class: String,
    desc: String,
    date: Date
});

module.exports = mongoose.model("Material", MaterialSchema);