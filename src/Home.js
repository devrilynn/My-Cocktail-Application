import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Filter from './Filter'; 
import IngredientThumbnails from './IngredientThumbnails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './index.css'; 

const Home = () => {
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  // Function to handle changes in the selected ingredients from the filter
  const handleFilterChange = (ingredients) => {
    setFilteredIngredients(ingredients);
  };

  // Function for handling the search button
  const handleSearch = () => {
    if (filteredIngredients.length > 0) {
      navigate('/recipes', { state: { ingredients: filteredIngredients } });
    }
  };

  // Function handle selecting a single ingredient
  const handleIngredientSelect = (selectedIngredient) => {
    navigate('/recipes', { state: { ingredient: selectedIngredient } });
  };

  // Function to toggle the filter button
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1>Browse Cocktails by Ingredient</h1>
        <div className="filter-search-container">
          <button onClick={toggleFilter} className="filter-button">
            {showFilter ? 'Hide Filter' : 'Filter By Multiple Ingredients'}
            &nbsp;<FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        {showFilter && (
          <>
            <Filter onFilterChange={handleFilterChange} />
            {filteredIngredients.length > 0 && (
              <div className="search-button-container">
                <button onClick={handleSearch} className="search-button">
                  Search Cocktails &nbsp;<FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            )}
          </>
        )}
        <IngredientThumbnails onIngredientSelect={handleIngredientSelect} />
      </div>
    </div>
  );
};

export default Home;
