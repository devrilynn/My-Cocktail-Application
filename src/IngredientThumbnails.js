import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import './Recipes.css';

const IngredientThumbnails = ({ onIngredientSelect }) => {
    // State that stores the ingredients
    const [ingredients, setIngredients] = useState([]);
    
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
                setIngredients(response.data.drinks);
            } catch (error) {
                console.error('Failed to fetch ingredients', error);
            }
        };
        fetchIngredients();
    }, []);
  
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    // Set random sizes for thumbnails
    const getRandomHeight = () => {
        const heights = ['200px', '250px', '300px', '350px', '400px'];
        return heights[Math.floor(Math.random() * heights.length)];
    };

    const handleClick = (ingredient) => {
        onIngredientSelect(ingredient);
    };

    return (
        <div className="ingredients-container">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
            >
                {ingredients.map(ingredient => (
                    <div 
                        key={ingredient.strIngredient1} 
                        onClick={() => handleClick(ingredient.strIngredient1)}  
                        className="masonry-grid_item"
                        style={{ height: getRandomHeight() }}
                    >
                        <img
                            src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.strIngredient1}-Medium.png`}
                            alt={ingredient.strIngredient1}
                            className="ingredient-image"
                        />
                        <p>{ingredient.strIngredient1}</p>
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default IngredientThumbnails;
