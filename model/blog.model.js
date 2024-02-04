const mongoose = require("mongoose");

const Blog = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'Employee'
  },
  slug: {
    type: String,
    trim: true,
    required: true,
  },
  categorie_id: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'Categorie'
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true
});

module.exports = {
  BlogModel: mongoose.model('blog', Blog),
};
