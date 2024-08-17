import axios from 'axios';

// Function to fetch recipes based on an ingredient
export const fetchRecipesByIngredient = async (ingredient, callback) => {
  try {
    const response = await axios.get('http://localhost:5000/api/search', {
      params: { i: ingredient }
    });
    callback(response.data);
  } catch (error) {
    console.error(`Error fetching the recipes for ${ingredient}`, error);
    callback([]);  // Pass empty array on error
  }
};

// Function to fetch recipes based on multiple ingredients
export const fetchRecipesByIngredients = async (ingredients, callback) => {
  try {
    const response = await axios.get('http://localhost:5000/api/search-recipes', {
      params: {
        ingredients: Array.isArray(ingredients) ? ingredients.join(',') : ingredients,      // If it's an array, join it; if it's a single string, use as is
      },
    });
    callback(response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    callback([]);
  }
};

// Function to fetch all available ingredients from the database
export const fetchAllIngredients = async (callback) => {
  try {
    const response = await axios.get('http://localhost:5000/api/ingredients');
    callback(response.data);
  } catch (error) {
    console.error('Error fetching the ingredients', error);
    callback([]);     
  }
};

const api = {
  fetchRecipesByIngredient,
  fetchRecipesByIngredients,
  fetchAllIngredients
};

export default api;
