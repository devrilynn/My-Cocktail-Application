require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGODB_URI;

async function fetchAndStoreRecipes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('CocktailDatabase');
    const collection = database.collection('cocktails');

    // Fetch all ingredients
    const ingredientsResponse = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
    const ingredients = ingredientsResponse.data.drinks.map(drink => drink.strIngredient1);

    // Fetch recipes for each ingredient
    for (const ingredient of ingredients) {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
      const recipes = response.data.drinks;

      if (recipes) {
        for (const recipe of recipes) {
          // Fetch detailed recipe info
          const detailedRecipeResponse = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipe.idDrink}`);
          const detailedRecipe = detailedRecipeResponse.data.drinks[0];

          await collection.updateOne(
            { id: detailedRecipe.idDrink },
            {
              $set: {
                id: detailedRecipe.idDrink,
                name: detailedRecipe.strDrink,
                ingredients: Object.keys(detailedRecipe)
                  .filter(key => key.startsWith('strIngredient') && detailedRecipe[key])
                  .map(key => detailedRecipe[key]),
                instructions: detailedRecipe.strInstructions,
                glass: detailedRecipe.strGlass,
                image: detailedRecipe.strDrinkThumb
              }
            },
            { upsert: true }
          );
        }
      }
    }

    console.log('Recipes successfully stored in MongoDB!');
  } catch (error) {
    console.error('Error fetching and storing recipes :(', error);
  } finally {
    await client.close();
  }
}


app.get('/api/backup-recipes', async (req, res) => {
  await fetchAndStoreRecipes();
  res.send('Recipes backed up successfully!');
});

app.get('/api/search', async (req, res) => {
  const ingredient = req.query.i;
  try {
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the recipes', error);
    res.status(500).send('Error fetching the recipes');
  }
});

app.get('/api/get-recipe/:id', async (req, res) => {
  console.log('Received request for recipe ID:', req.params.id); 
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB'); 
    const database = client.db('CocktailDatabase');
    const collection = database.collection('cocktails');

    const recipe = await collection.findOne({ id: req.params.id });
    console.log('Fetched recipe:', recipe); 

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).send('Error fetching recipe details');
  } finally {
    await client.close();
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
