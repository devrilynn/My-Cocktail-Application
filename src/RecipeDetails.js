import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPinterest, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import './Recipes.css'; 

// Recipe Details component 
const RecipeDetails = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Function to fetch the recipe details
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-recipe/${id}`);
        setRecipe(response.data);
        checkIfFavorite(response.data._id);
      } catch (error) {
        console.error('Error fetching the recipe details', error);
      }
    };

    // Function to check if the recipe is saved as a favorite
    const checkIfFavorite = async (recipeId) => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) return;
    
      try {
        const response = await axios.get(`http://localhost:5000/api/get-saved-recipes/${user.id}`);
        const savedRecipes = response.data.recipes;
        
        // Check if the current recipe is in the saved recipes
        const isFav = savedRecipes.some(r => r && r._id === recipeId);
        console.log("Is Favorite:", isFav);
        setIsFavorite(isFav);
      } catch (error) {
        console.error('Error checking if favorite', error);
      }
    };

    fetchRecipe();
  }, [id]); // Re-run effect when ID changes

  if (!recipe) return <div>Loading...</div>;

  // Function to handle saving/un-saving the recipe as a favorite
  const toggleSaveRecipe = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/toggle-favorite', {
        userId: user.id,
        recipeId: recipe._id,
      });
      setIsFavorite(response.data.isFavorite); // Update the state based on the response
    } catch (error) {
      console.error('Error toggling recipe favorite status:', error);
    }
  };

  // Function to handle navigation back to the previous page
  const handleBackToResults = () => {
    if (location.state && location.state.from) {
        // Pass back the correct state when navigating
        navigate(location.state.from, { state: { ingredients: location.state.ingredients || [location.state.ingredient] } });
    } else {
        navigate('/');
    }
};

  // Function to preprocess and format the recipe instructions using regex
  // A new line when there is a period, a space after a number followed by a period,
  // and split into separate steps based on some recipes that contain numbers
  function preprocessInstructions(instructions) {
    const formattedInstructions = instructions.replace(/(\d\.)/g, '$1 ');
    const steps = formattedInstructions.includes('1. ')
      ? formattedInstructions.split(/(\d+\.\s+)/g)
      : formattedInstructions.split(/(?<=\.)\s+/g);

    return steps
      .filter(step => step.trim() !== '')
      .map((step, index, array) => {
        if (/^\d+\.\s*$/.test(step)) {
          return <React.Fragment key={index}>{step.trim()} {array[index + 1]?.trim()}<br /></React.Fragment>;
        } else if (!/^\d+\.\s*$/.test(array[index - 1])) {
          return <React.Fragment key={index}>{step.trim()}<br /></React.Fragment>;
        } else {
          return null;
        }
      });
  }

  return (
    <div>
      <NavBar />
      <div className="back-button">
        <button onClick={handleBackToResults}>Back to Cocktail Recipes</button>
      </div>
      <div className="recipe-details-container">
        <div className="title-save-share">
          <div className="title-heart">
            <h1>{recipe.name}</h1>
            <FontAwesomeIcon 
              icon={isFavorite ? solidHeart : regularHeart} 
              onClick={toggleSaveRecipe} 
              className="save-icon"
            />
          </div>
        </div>
        <img src={recipe.image} alt={recipe.name} className="recipe-image" />
        <h2>Ingredients:</h2>
        <ul className="list-format">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h2>Instructions:</h2>
        <p>{preprocessInstructions(recipe.instructions)}</p>
        <h3>Glass: {recipe.glass}</h3>
      </div>
      <div className="social-share-buttons">
        <a 
          href={`https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${recipe.image}&description=${recipe.name}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-button pinterest"
        >
          <FontAwesomeIcon icon={faPinterest} />
        </a>
        <a 
          href={`https://www.instagram.com/?url=${window.location.href}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-button instagram"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-button facebook"
        >
          <FontAwesomeIcon icon={faFacebook} />
        </a>
      </div>
    </div>
  );
};

export default RecipeDetails;
