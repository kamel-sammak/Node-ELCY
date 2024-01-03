const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({


  content: {
    type: String,
    //     required: [true, "Please enter the post"],
  },

  title: { type: String },


  company: {
    type: mongoose.Schema.Types.ObjectId,

  },

  //isLike: { type: Boolean }



});
const Post = mongoose.model('post', postSchema);
module.exports = Post;