import React from 'react';
import './SharedComponents.css';
import { useTheme } from '../../contexts/ThemeContext';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = ({ message = 'Loading...' }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`loading-container ${isDarkMode ? 'dark' : 'light'}`}>
      <CircularProgress color="inherit" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default Loading;
