var mongoose = require("mongoose");
const { Schema } = mongoose;

var PostSchema = new Schema(
  {
    message: String,
    sender: String,
    owner: String,
    name: String,
  },
  { collection: "catstone.posts" }
);

module.exports = mongoose.model("post", PostSchema, "posts");
