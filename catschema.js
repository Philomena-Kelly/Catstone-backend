var mongoose = require("mongoose");
const { Schema } = mongoose;

var CatSchema = new Schema(
  {
    name: String,
    location: String,
    color: String,
    treat_count: Number,
    owner: String,
    weather: String,
  },
  { collection: "catstone.cats" }
);

module.exports = mongoose.model("cat", CatSchema, "cats");
