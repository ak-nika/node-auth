const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post needs a title"],
      trim: true,
      minLength: [5, "Title must be at least 5 characters"],
    },
    description: {
      type: String,
      required: [true, "A post needs a description"],
      trim: true,
      minLength: [5, "Title must be at least 5 characters"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A post needs a user"],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
