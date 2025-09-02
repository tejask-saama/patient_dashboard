import React from 'react';
import './Header.css';
import { useTheme } from '../../contexts/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={`header ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header-container">
        <h1 className="app-title">Patient Healthcare Dashboard</h1>
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
