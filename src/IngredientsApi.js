import axios from 'axios';

// Function to fetch recipes based on an ingredient
export const fetchRecipesByIngredient = async (ingredient, callback) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/search?i=${encodeURIComponent(ingredient)}`);
    callback(response.data.drinks);
  } catch (error) {
    console.error(`Error fetching the recipes for ${ingredient}`, error);
    callback([]);     // Pass empty array on error
  }
};

export default fetchRecipesByIngredient;
