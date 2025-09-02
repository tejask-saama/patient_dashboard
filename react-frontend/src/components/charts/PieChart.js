import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Charts.css';

const PieChart = ({ data, labelKey, valueKey, isDarkMode }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Color palette that fits medical theme
  const lightColors = [
    'rgba(10, 110, 189, 0.8)', // Primary blue
    'rgba(69, 207, 221, 0.8)', // Secondary teal
    'rgba(95, 189, 255, 0.8)', // Accent blue
    'rgba(45, 149, 150, 0.8)', // Teal
    'rgba(90, 173, 246, 0.8)', // Light blue
    'rgba(62, 142, 208, 0.8)', // Mid blue
  ];
  
  const darkColors = [
    'rgba(26, 143, 227, 0.8)', // Primary blue
    'rgba(77, 181, 255, 0.8)', // Secondary blue
    'rgba(88, 166, 255, 0.8)', // Accent blue
    'rgba(64, 179, 181, 0.8)', // Teal
    'rgba(109, 184, 241, 0.8)', // Light blue
    'rgba(81, 154, 212, 0.8)', // Mid blue
  ];

  const colors = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    if (!data || !data.length) return;

    const labels = data.map(item => item[labelKey]);
    const values = data.map(item => item[valueKey]);
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: isDarkMode ? 'rgba(42, 42, 42, 1)' : 'white',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: isDarkMode ? '#e0e0e0' : '#333333',
              padding: 15,
              usePointStyle: true,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: isDarkMode ? '#e0e0e0' : '#333333',
            bodyColor: isDarkMode ? '#b0b0b0' : '#666666',
            borderColor: isDarkMode ? '#444444' : '#e0e0e0',
            borderWidth: 1,
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labelKey, valueKey, isDarkMode, colors]);

  if (!data || data.length === 0) {
    return <div className="no-data-message">No data available</div>;
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
