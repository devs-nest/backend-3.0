
const Comment = require("../models/Comment");

module.exports = {

  postComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        createdBy:req.user.userName,
        createdById:req.user.id
      });
      console.log("comment added");
      res.redirect("/post/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment:async (req,res)=>{
    try {
        await Comment.deleteOne({_id :req.params.commentId});
        res.redirect("/post/"+req.params.postid);
    } catch (error) {
        console.log(error)
    }
  }
};
