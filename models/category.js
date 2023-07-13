const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
