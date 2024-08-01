import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { fetchRecipesByIngredient } from './IngredientsApi';
import Masonry from 'react-masonry-css';
import './Recipes.css';

const Recipes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);               
    const ingredient = location.state?.ingredient;

    useEffect(() => {
        if (ingredient) {
            fetchRecipesByIngredient(ingredient, (data) => {
                setRecipes(data);
                setLoading(false);              // Set loading to false after data is fetched
            });
        } else {
            navigate('/');
        }
    }, [ingredient, navigate]);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div>
            <NavBar />
            <div className="back-button">
                <button onClick={() => navigate('/')}>Back to Ingredients</button>
            </div>
            <div className="container">
                <h1>Recipes with {ingredient}</h1>
                {loading ? (                        // Conditional rendering based on loading state
                    <p>Loading...</p> 
                ) : recipes.length > 0 ? (          // If recipes are available
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="masonry-grid"
                        columnClassName="masonry-grid_column"
                    >
                        {recipes.map(recipe => ( 
                            <Link to={`/RecipeDetails/${recipe.idDrink}`} state={{ from: location.pathname, ingredient: ingredient }} key={recipe.idDrink}>
                                <div className="masonry-grid_item">
                                    <img src={recipe.strDrinkThumb} alt={recipe.strDrink} className="ingredient-image" />
                                    <p>{recipe.strDrink}</p>
                                </div>
                            </Link>
                        ))}
                    </Masonry>
                ) : (
                    <p>No recipes found for {ingredient}</p> 
                )}
            </div>
        </div>
    );
};

export default Recipes;
