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

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById(id).populate("userId", "email");
    if (!post) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Post not found" });
    }
    res.status(200).json({
      status: "Success",
      post,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid post ID",
      });
    }
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    const post = await Posts.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    ).populate("userId", "email");

    if (!post) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Post not found" });
    }
    if (post.userId._id.toString() !== userId) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not authorized to update this post",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid post ID",
      });
    }
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Posts.findByIdAndDelete(id);

    if (!post) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Post not found" });
    }
    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not authorized to delete this post",
      });
    }
    res.status(204).json({
      status: "Success",
      message: "Post deleted successfully",
      post: null,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid post ID",
      });
    }
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
