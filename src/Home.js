import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import IngredientThumbnails from './IngredientThumbnails';
import './index.css'; 

const Home = () => {
  const [ingredient, setIngredient] = useState('');
  const navigate = useNavigate();

  // Function to handle searches
  const handleSearch = () => {
    if (ingredient) {
      navigate('/recipes', { state: { ingredient } });
    }
  };

  // Function to handle ingredient selection from thumbnails
  const handleIngredientSelect = (selectedIngredient) => {
    navigate('/recipes', { state: { ingredient: selectedIngredient } });
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1>Welcome to ElixirMixer!</h1>
        <p>Find cocktail recipes based on the ingredients you have on hand.</p>
        <input
          type="text"
          value={ingredient}
          className="search-box"
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Enter an ingredient on hand..."
        />
        <button onClick={handleSearch}>Search</button>
        <h2>Browse Cocktails by Ingredient</h2>
        <IngredientThumbnails onIngredientSelect={handleIngredientSelect} />      
      </div>
    </div>
  );
};

export default Home;
