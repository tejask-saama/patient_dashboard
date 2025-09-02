import React from 'react';
import './TabNavigation.css';
import { useTheme } from '../../contexts/ThemeContext';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`tab-navigation ${isDarkMode ? 'dark' : 'light'}`}>
      <button
        className={`tab-button ${activeTab === 'demographics' ? 'active' : ''}`}
        onClick={() => setActiveTab('demographics')}
        aria-label="View Patient Demographics"
      >
        <PersonIcon />
        <span>Patient Demographics</span>
      </button>
      <button
        className={`tab-button ${activeTab === 'adverse' ? 'active' : ''}`}
        onClick={() => setActiveTab('adverse')}
        aria-label="View Adverse Events"
      >
        <WarningAmberIcon />
        <span>Adverse Events</span>
      </button>
    </div>
  );
};

export default TabNavigation;
