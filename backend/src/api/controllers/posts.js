const Post = require("../models/post");
const User = require("../models/user");
const moment = require('moment')

async function createPost(req, res) {
  // Validate the request body
  if (!req.body.desc) {
    return res.status(400).json({ message: "Post desc is required." });
  }

  // Find the authenticated user
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Create a new post
  const post = new Post({
    desc: req.body.desc,
    title:req.body.title,
    user: user.id,
    likes: [],
    comments: [],
    created_at: moment().format()
  });
  post.save(async(err) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }
    // Add the post to the user's posts list
  user.posts.push(post.id);
  await user.save();
    res.status(201).json({
      id: post.id,
      title: post.title,
      created_at: post.created_at
    });
  });
}

async function deletePost(req, res) {
  // Find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Check if the authenticated user is the creator of the post
  if (post.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ message: "You are not authorized to delete this post." });
  }

  // Delete the post
  await post.remove();

  // Return the deleted post
  return res.json({message:"Deleted successfully"});
}

async function likePost(req, res) {
  // Find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Check if the authenticated user has already liked the post
  if (post.likes.includes(req.user.id)) {
    return res
      .status(400)
      .json({ message: "You have already liked this post." });
  }

  // Add the authenticated user's ID to the post's likes array
  post.likes.push(req.user.id);
  await post.save();

  // Return the updated post
  return res.json(post);
}

async function unlikePost(req, res) {
  // Find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Check if the authenticated user has liked the post
  if (!post.likes.includes(req.user.id)) {
    return res.status(400).json({ message: "You have not liked this post." });
  }

  // Remove the authenticated user's ID from the post's likes array
  post.likes = post.likes.filter((id) => id != req.user.id);
  await post.save();

  // Return the updated post
  return res.json(post);
}

async function addComment(req, res) {
  // Validate the request body
  if (!req.body.text) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  // Find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Create a new comment
  const comment = {
    user: req.user.id,
    text: req.body.text,
  };
  post.comments.push(comment);
  await post.save();

  // Return the comment details
  return res.json({id:comment.id});
}

async function getPost(req, res) {
  // Find the post
  const post = await Post.findById(req.params.id).populate("user", ["name"]);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Return the post data
  return res.json({
    id: post.id,
    likes: post.likes.length,
    comments: post.comments.length,
  });
}

async function getAllPosts(req, res) {
  // Find the authenticated user
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Find the user's posts
  const posts = await Post.find({ user: user.id }).sort({ date: -1 });

  // Return the posts data
  return res.json(posts);
}

module.exports = {
  createPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getAllPosts,
  getPost,
};
