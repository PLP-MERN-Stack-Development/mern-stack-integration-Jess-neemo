// server/models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [30, 'Name cannot exceed 30 characters'],
  },
  description: {
    type: String,
    maxlength: [200, 'Description too long'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);