import React, { useState, useEffect } from 'react';
import './AdverseEvents.css';
import api from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import DashboardCard from '../shared/DashboardCard';
import StatCard from '../shared/StatCard';
import {
  BarChart,
  LineChart,
  HorizontalBarChart
} from '../charts';

const AdverseEvents = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsData = await api.getAdverseEvents();
        setData(eventsData);
        setError(null);
      } catch (err) {
        setError('Failed to load adverse events data. Please try again later.');
        console.error('Error fetching adverse events data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading message="Loading adverse events data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <ErrorMessage message="No adverse events data available" />;

  return (
    <div className={`adverse-events ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-header">
        <h2>Adverse Events</h2>
        <div className="last-updated">Last updated: {new Date().toLocaleString()}</div>
      </div>

      <div className="dashboard-stats">
        <StatCard 
          title="Total Events" 
          value={data.totals?.total_events || 0}
          icon="warning"
          theme={isDarkMode ? 'dark' : 'light'}
        />

        <StatCard 
          title="Average Resolution Time" 
          value={`${(data.totals?.average_time_to_resolution_days || 0).toFixed(2)} days`}
          icon="time"
          theme={isDarkMode ? 'dark' : 'light'}
        />

        <StatCard 
          title="Ongoing Events" 
          value={data.totals?.total_ongoing_events || 0}
          icon="trending"
          theme={isDarkMode ? 'dark' : 'light'}
        />
      </div>

      <div className="dashboard-grid">
        <DashboardCard title="Events by Type">
          <HorizontalBarChart
            data={data.distributions?.by_type || []}
            labelKey="label"
            valueKey="count"
            label="Events"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>

        <DashboardCard title="Events by Severity">
          <BarChart
            data={data.distributions?.by_severity || []}
            labelKey="label"
            valueKey="count"
            label="Events"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>
        
        <DashboardCard title="Events by Location">
          <HorizontalBarChart
            data={data.distributions?.by_location || []}
            labelKey="label"
            valueKey="count"
            label="Events"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>

        <DashboardCard title="Events Over Time" wide={true}>
          <LineChart
            data={data.over_time || []}
            labelKey="period"
            valueKey="count"
            label="Events"
            isDarkMode={isDarkMode}
          />
        </DashboardCard>
      </div>
    </div>
  );
};

export default AdverseEvents;
