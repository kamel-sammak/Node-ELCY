const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({

  content: {
    type: String,
    required: [true, "please enter content !"]
  },
  title: {
    type: String,
    required: [true, "please enter title !"]
  },
  company: { type: mongoose.Schema.Types.ObjectId, },
  postContent: {
    type: String,
    required: [false, "please enter post content !"]
  },

});
const Post = mongoose.model('post', postSchema);
module.exports = Post;