import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import TabNavigation from './components/TabNavigation/TabNavigation';
import PatientDemographics from './components/PatientDemographics/PatientDemographics';
import AdverseEvents from './components/AdverseEvents/AdverseEvents';

function App() {
  const [activeTab, setActiveTab] = useState('demographics');

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="content-container">
          {activeTab === 'demographics' ? 
            <PatientDemographics /> : 
            <AdverseEvents />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
