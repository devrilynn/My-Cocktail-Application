const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Ensures that each recipe has a unique ID
  },
  name: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  instructions: {
    type: String,
    required: true,
  },
  glass: {
    type: String,
  },
  image: {
    type: String,
  },
}, { collection: 'cocktails' });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
