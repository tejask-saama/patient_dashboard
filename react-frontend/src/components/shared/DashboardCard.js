import React from 'react';
import './SharedComponents.css';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardCard = ({ title, children, wide = false }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`dashboard-card ${wide ? 'wide' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-card-header">
        <h3>{title}</h3>
      </div>
      <div className="dashboard-card-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
