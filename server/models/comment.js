const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    reelId: { type: Schema.Types.ObjectId, ref: "Reel", required: true }, 
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    text: { type: String, required: true },
    likes: { type: Number, default:0}, 
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // Null if it's a top-level comment
    createdAt: { type: Date, default: Date.now }
});




commentSchema.index({ reelId: 1, parentCommentId: 1, createdAt: -1 }); // for reply's
commentSchema.index({ reelId: 1, createdAt: -1 }); // for top-level comment


const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
