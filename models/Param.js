var mongoose = require("mongoose");

var ParamSchema = new mongoose.Schema({
    searchTags: [String],
});

module.exports = mongoose.model("Param", ParamSchema);