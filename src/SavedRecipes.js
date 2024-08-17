import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './SavedRecipes.css';

// Saved Recipes component
const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch all the saved recipes
    const fetchSavedRecipes = async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/get-saved-recipes/${user.id}`);
        setSavedRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    fetchSavedRecipes();
  }, [navigate]);

  const handleRecipeClick = (recipeId) => {
    navigate(`/RecipeDetails/${recipeId}`);
  };

  if (!loading && !savedRecipes.length) {
    return <div>No saved recipes found.</div>;
  }

  return (
    <div>
      <NavBar />
      <h1 className="saved-recipes-header">Saved Cocktails</h1>
      <div className="saved-recipes-container">
        {savedRecipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="recipe-card" 
            onClick={() => handleRecipeClick(recipe.id)}
          >
             <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            <h3>{recipe.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;
