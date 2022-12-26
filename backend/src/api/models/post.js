const mongoose = require('mongoose');
const moment = require('moment')

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  desc: { type: String, required: true },
  title: {type:String, required:true},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true }
  }],
  created_at: {
    type: Date,
    default: moment().format()
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
