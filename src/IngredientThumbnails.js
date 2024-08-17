import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { fetchAllIngredients } from './IngredientsApi';
import './Recipes.css';

// Function to handle the images of ingredients
const IngredientThumbnails = ({ onIngredientSelect }) => {
    const [ingredients, setIngredients] = useState([]);
    const [heights, setHeights] = useState({});

    useEffect(() => {
        fetchAllIngredients((ingredientsData) => {
            setIngredients(ingredientsData);

            const generatedHeights = {};
            ingredientsData.forEach(ingredient => {
                generatedHeights[ingredient._id] = getRandomHeight();
            });
            setHeights(generatedHeights);
        });
    }, []);

    // Function to define the columns for the masonry layout
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    // Function to create random heights for masonry layout
    const getRandomHeight = () => {
        const heights = ['300px', '350px', '400px'];
        return heights[Math.floor(Math.random() * heights.length)];
    };

    const handleClick = (ingredient) => {
        onIngredientSelect(ingredient.name);
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
                        key={ingredient._id}  
                        onClick={() => handleClick(ingredient)}  
                        className="masonry-grid_item"
                        style={{ height: heights[ingredient._id] }}  
                    >
                        <img
                            src={ingredient.image}  
                            alt={ingredient.name}
                            className="ingredient-image"
                        />
                        <p>{ingredient.name}</p>
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default IngredientThumbnails;
