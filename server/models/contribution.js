const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contributionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topics: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    githubUrl: { type: String, required: true },
  },
  { timestamps }
);

contributionSchema.index({ userId: 1, createdAt: -1,});
contributionSchema.index({  topics: 1 });

const Contribution = mongoose.model("Contribution", contributionSchema);
module.exports = Contribution;
