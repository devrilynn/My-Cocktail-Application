import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; 

// NavBar component
const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); 
  const [ingredient, setIngredient] = useState(''); 
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if the user is logged in by looking for session info in sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.id) {
      setIsLoggedIn(true);
      setUserName(user.firstName);  
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');  
  };

  // Function to toggle the dropdown menu visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to navigate to the saved recipes page
  const handleViewSavedRecipes = () => {
    navigate('/saved-recipes'); 
  };

  // Function to handle clicks outside the dropdown to close it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSearch = () => {
    if (ingredient) {
      navigate('/recipes', { state: { ingredient } });
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <h3>ElixirMixer&nbsp;</h3>
        <i className="fa fa-glass logo-icon"></i>
      </Link>
      <div className="navbar-search">
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
          placeholder="Search for cocktails by ingredient"
        />
        <i className="fa fa-search search-icon" onClick={handleSearch}></i>
      </div>
      <div className="navbar-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="user-greeting">Hi, {userName}</span>
            <div className="profile-dropdown" ref={dropdownRef}>
              <i className="fa fa-user-circle-o" onClick={toggleDropdown}></i>
              {showDropdown && (
                <div className="dropdown-content">
                  <span className="dropdown-item" onClick={handleViewSavedRecipes}>Saved Cocktails</span>
                  <span className="dropdown-item" onClick={handleLogout}>Logout</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
