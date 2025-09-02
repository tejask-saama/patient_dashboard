import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import theme from './theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PatientDemographics from './pages/PatientDemographics';
import AdverseEvents from './pages/AdverseEvents';
import './styles/index.css';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/demographics" element={<PatientDemographics />} />
            <Route path="/adverse-events" element={<AdverseEvents />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
};

export default App;
