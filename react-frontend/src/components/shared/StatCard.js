import React from 'react';
import './SharedComponents.css';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatCard = ({ title, value, icon, theme }) => {
  const renderIcon = () => {
    switch(icon) {
      case 'person':
        return <PersonIcon className="stat-icon" />;
      case 'warning':
        return <WarningAmberIcon className="stat-icon" />;
      case 'time':
        return <AccessTimeIcon className="stat-icon" />;
      case 'trending':
        return <TrendingUpIcon className="stat-icon" />;
      default:
        return <TrendingUpIcon className="stat-icon" />;
    }
  };

  return (
    <div className={`stat-card ${theme}`}>
      <div className="stat-icon-container">
        {renderIcon()}
      </div>
      <div className="stat-content">
        <h4 className="stat-title">{title}</h4>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
