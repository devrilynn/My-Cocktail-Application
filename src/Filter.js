import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Filter.css'; 

// Component that renders the filter funcitonality
const Filter = ({ onFilterChange }) => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ingredients'); 
        setIngredients(response.data);
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
      }
    };
    fetchIngredients();
  }, []);

  // Function to handle the select of an ingredient
  const handleSelectIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      const updatedSelection = [...selectedIngredients, ingredient];
      setSelectedIngredients(updatedSelection);
      onFilterChange(updatedSelection);
    }
  };

  // Function that handles removing an ingredient
  const handleRemoveIngredient = (ingredient) => {
    const updatedSelection = selectedIngredients.filter(i => i !== ingredient);
    setSelectedIngredients(updatedSelection);
    onFilterChange(updatedSelection);
  };

  return (
    <div className="filter-container">
      <div className="available-ingredients">
        <h3>Select Ingredients</h3>
        <ul>
          {ingredients.map((item) => (
            <li key={item._id} onClick={() => handleSelectIngredient(item.name)}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="selected-ingredients">
        <h3>Selected Ingredients</h3>
        <ul>
          {selectedIngredients.map((item) => (
            <li key={item}>
              {item} <span onClick={() => handleRemoveIngredient(item)} className="remove-ingredient">x</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Filter;
