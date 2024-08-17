const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const favoriteSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  recipe: {
    type: ObjectId,
    ref: 'Recipe',
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
