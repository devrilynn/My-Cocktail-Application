import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './Recipes.css'; 

const RecipeDetails = () => {
  const { id } = useParams();                    // use URL paramaters to get recipe ID
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-recipe/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching the recipe details', error);
      }
    };

    fetchRecipe();
  }, [id]);           // Dependency array, re-run effect when ID changes

  if (!recipe) return <div>Loading...</div>;

  const handleBackToResults = () => {
     // Check if there is a previous location state
    if (location.state && location.state.from) {
      navigate(location.state.from, { state: { ingredient: location.state.ingredient } });
    } else {
      navigate('/');  
    }
  };

  return (
    <div>
      <NavBar />
      <div className="back-button">
        <button onClick={handleBackToResults}>Back to Cocktail Recipes</button>
      </div>
      <div className="recipe-details-container">
        <h1>{recipe.name}</h1>
        <img src={recipe.image} alt={recipe.name} className="recipe-image" />
        <h2>Ingredients:</h2>
        <ul className="list-format">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h2>Instructions:</h2>
        <p>{recipe.instructions}</p>
        <h3>Glass: {recipe.glass}</h3>
      </div>
    </div>
  );
};

export default RecipeDetails;
