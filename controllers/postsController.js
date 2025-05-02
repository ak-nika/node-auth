const { postSchema } = require("../middlewares/validators");
const Posts = require("../models/postsModel");

exports.getAllPosts = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = 10;

    let pageNumber = 0;
    if (pageNumber > 1) {
      pageNumber = parseInt(page) - 1;
    }

    const posts = await Posts.find()
      .sort({ createdAt: -1 })
      .skip(pageNumber * limit)
      .limit(limit)
      .populate("userId", "email");

    res.status(200).json({
      status: "Success",
      results: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.user;
    const { error, value } = postSchema.validate({ title, description, id });
    if (error) {
      return res.status(400).json({ status: "Failed", message: error.message });
    }
    const post = await Posts.create({
      title,
      description,
      userId: id,
    });
    res.status(201).json({
      status: "Success",
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.getPostById = async (req, res) => {};

exports.updatePost = async (req, res) => {};

exports.deletePost = async (req, res) => {};
