const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({

    post: {
        type: String,
        required: [true, "Please enter the post"],
      },
  

    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "name",
        required: [false, "Please enter the hospitalName ID"],
      },  


      


    });
const Post = mongoose.model('post',postSchema);
module.exports = Post;