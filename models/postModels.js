const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({

  content: { type: String, },
  title: { type: String },
  company: { type: mongoose.Schema.Types.ObjectId, },

  //post cv

});
const Post = mongoose.model('post', postSchema);
module.exports = Post;