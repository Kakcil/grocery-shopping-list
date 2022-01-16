const mongoose = require("mongoose");

// to duplicate id for UI instead of _id
const opts = { toJSON: { virtuals: true } };
const PostSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  opts
);



module.exports = mongoose.model("items", PostSchema);
