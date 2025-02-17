const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reelSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true }, // Cloud storage URL
    thumbnailUrl: { type: String },
    duration: { type: Number },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    techStack: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

reelSchema.index({ userId: 1, createdAt: -1 });
reelSchema.index({ techStack: 1 });


const Reel = mongoose.model("Reel", reelSchema);
module.exports = Reel;
