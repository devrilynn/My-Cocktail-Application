require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const User = require('./models/User');
const Ingredient = require('./models/Ingredient');
const Recipe = require('./models/Recipe');
const Favorite = require('./models/Favorite');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'CocktailDatabase', 
});

// Registration route
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, dateOfBirth, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      dateOfBirth,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received login request for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful');
    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user._id, 
        firstName: user.firstName 
      } 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Save/unsave a recipe
app.post('/api/toggle-favorite', async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({ user: userId, recipe: recipeId });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.status(200).json({ message: 'Recipe removed from favorites', isFavorite: false });
    } else {
      const favorite = new Favorite({
        user: userId,
        recipe: recipeId,
      });
      await favorite.save();
      return res.status(201).json({ message: 'Recipe added to favorites', isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    return res.status(500).json({ message: 'Server error during favorite toggle' });
  }
});

// Fetch saved recipes route
app.get('/api/get-saved-recipes/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.params.userId }).populate('recipe');

    if (!favorites.length) {
      return res.status(404).json({ message: 'No saved recipes found' });
    }

    const recipes = favorites.map(fav => fav.recipe).filter(r => r !== null); 
    res.json({ recipes });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ message: 'Server error during fetching saved recipes' });
  }
});

// Search recipes by ingredient route
app.get('/api/search', async (req, res) => {
  const ingredient = req.query.i.trim();
  
  try {
    const recipes = await Recipe.find({
      ingredients: { $regex: new RegExp(ingredient, "i") } // Case-insensitive search
    });

    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: 'No recipes found for this ingredient' });
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).send('Error fetching recipes');
  }
});

// Search recipes by multiple ingredients route
app.get('/api/search-recipes', async (req, res) => {
  const ingredients = req.query.ingredients.split(','); // Split the comma-separated ingredients

  try {
    const recipes = await Recipe.find({
      ingredients: { $all: ingredients } // Matches all specified ingredients
    });

    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: 'No recipes found with the selected ingredients' });
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).send('Server error while fetching recipes');
  }
});

// Get recipe details by ID route
app.get('/api/get-recipe/:id', async (req, res) => {
  console.log('Received request for recipe ID:', req.params.id); 
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB'); 
    const database = client.db('CocktailDatabase');
    const collection = database.collection('cocktails');

    const recipe = await collection.findOne({ id: req.params.id });

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).send('Error fetching recipe details');
  } finally {
    await client.close();
  }
});

// Get all ingredients route
app.get('/api/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 }); // Sort by name in ascending order
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
