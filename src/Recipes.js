import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { fetchRecipesByIngredient, fetchRecipesByIngredients } from './IngredientsApi';
import Masonry from 'react-masonry-css';
import './Recipes.css';

// Recipes component
const Recipes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const ingredient = useMemo(() => location.state?.ingredient, [location.state?.ingredient]);
    const ingredients = useMemo(() => location.state?.ingredients || (ingredient ? [ingredient] : []), [location.state?.ingredients, ingredient]);

    useEffect(() => {
        if (ingredients.length > 0) {
            if (ingredients.length > 1) {
                fetchRecipesByIngredients(ingredients, (data) => {
                    handleFetchResults(data);
                });
            } else if (ingredients.length === 1) {
                fetchRecipesByIngredient(ingredients[0], (data) => {
                    handleFetchResults(data);
                });
            }
        } else {
            navigate('/');
        }
    }, [ingredients, navigate]);

    // Function to handle the results from the API call.
    const handleFetchResults = (data) => {
        if (data && data.length > 0) {
            setRecipes(data);
            setErrorMessage('');
        } else {
            setErrorMessage(`No recipes found with the selected ingredients.`);
            setRecipes([]);
        }
        setLoading(false);
    };

    // Function to set columns for display of recipes
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div>
            <NavBar />
            <div className="header-container">
              <div className="back-button">
                <button className="back-button" onClick={() => navigate('/')}>Back to Ingredients</button>
              </div>
              <h1 className="header-title">Recipes with {ingredients.join(', ')}</h1>
            </div>
            <div className="container">
                {loading ? (
                    <p>Loading...</p>
                ) : errorMessage ? (
                    <p>{errorMessage}</p>
                ) : (
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="masonry-grid"
                        columnClassName="masonry-grid_column"
                    >
                        {recipes.map(recipe => (
                            <Link to={`/RecipeDetails/${recipe.id}`} state={{ from: location.pathname, ingredients }} key={recipe.id}>
                                <div className="masonry-grid_item">
                                    <img src={recipe.image} alt={recipe.name} className="ingredient-image" />
                                    <p>{recipe.name}</p>
                                </div>
                            </Link>
                        ))}
                    </Masonry>
                )}
            </div>
        </div>
    );
};

export default Recipes;
