import React from 'react';
import './SharedComponents.css';
import { useTheme } from '../../contexts/ThemeContext';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorMessage = ({ message = 'An error occurred.' }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`error-container ${isDarkMode ? 'dark' : 'light'}`}>
      <ErrorOutlineIcon className="error-icon" />
      <p className="error-message">{message}</p>
    </div>
  );
};

export default ErrorMessage;
