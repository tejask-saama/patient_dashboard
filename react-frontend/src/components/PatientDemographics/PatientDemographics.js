import React, { useState, useEffect } from 'react';
import './PatientDemographics.css';
import api from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import DashboardCard from '../shared/DashboardCard';
import StatCard from '../shared/StatCard';
import {
  PieChart,
  BarChart,
  LineChart,
  HorizontalBarChart
} from '../charts';

const PatientDemographics = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const demographicsData = await api.getPatientDemographics();
        setData(demographicsData);
        setError(null);
      } catch (err) {
        setError('Failed to load patient demographics data. Please try again later.');
        console.error('Error fetching demographics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading message="Loading patient demographics..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <ErrorMessage message="No demographic data available" />;

  // Process age data for better visualization (group into age ranges)
  const processAgeData = (ageData) => {
    // Create age bins (0-9, 10-19, etc.)
    const ageBins = Array(11).fill(0).map((_, i) => ({
      label: `${i*10}-${i*10+9}`,
      count: 0
    }));

    // Assign each age to the appropriate bin
    ageData?.forEach(item => {
      const age = parseInt(item.value);
      if (!isNaN(age)) {
        const binIndex = Math.min(Math.floor(age / 10), 10);
        ageBins[binIndex].count += item.count;
      }
    });

    return ageBins;
  };

  return (
    <div className={`patient-demographics ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-header">
        <h2>Patient Demographics</h2>
        <div className="last-updated">Last updated: {new Date().toLocaleString()}</div>
      </div>

      <div className="dashboard-stats">
        <StatCard 
          title="Total Patients" 
          value={data.total_patient_count || 0}
          icon="person"
          theme={isDarkMode ? 'dark' : 'light'}
        />
      </div>

      <div className="dashboard-grid">
        <DashboardCard title="Gender Distribution">
          <PieChart 
            data={data.gender_distribution || []} 
            labelKey="label" 
            valueKey="count"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>

        <DashboardCard title="Age Distribution">
          <BarChart
            data={processAgeData(data.age_distribution || [])}
            labelKey="label"
            valueKey="count"
            label="Patients"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>

        <DashboardCard title="Top Cities">
          <HorizontalBarChart
            data={data.geography?.top_cities || []}
            labelKey="city"
            valueKey="count"
            label="Patients"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>

        <DashboardCard title="Locale Breakdown">
          <BarChart
            data={data.geography?.locale_breakdown || []}
            labelKey="locale"
            valueKey="count"
            label="Patients"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>

        <DashboardCard title="Registration Trends (Monthly)" wide={true}>
          <LineChart
            data={data.registration_trends?.overall || []}
            labelKey="period"
            valueKey="count"
            label="Registrations"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>

      </div>
    </div>
  );
};

export default PatientDemographics;
