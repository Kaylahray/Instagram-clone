const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    user:{
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    description: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
