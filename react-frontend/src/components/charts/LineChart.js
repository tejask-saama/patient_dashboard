import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Charts.css';

const LineChart = ({ data, labelKey, valueKey, label, isDarkMode }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!data || !data.length) return;

    const labels = data.map(item => item[labelKey]);
    const values = data.map(item => Number(item[valueKey] || 0));
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          fill: true,
          backgroundColor: isDarkMode 
            ? 'rgba(26, 143, 227, 0.2)' 
            : 'rgba(10, 110, 189, 0.2)',
          borderColor: isDarkMode 
            ? 'rgba(26, 143, 227, 1)' 
            : 'rgba(10, 110, 189, 1)',
          borderWidth: 2,
          tension: 0.3,
          pointBackgroundColor: isDarkMode 
            ? 'rgba(26, 143, 227, 1)' 
            : 'rgba(10, 110, 189, 1)',
          pointBorderColor: isDarkMode 
            ? '#1e1e1e' 
            : '#ffffff',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: isDarkMode ? 'rgba(70, 70, 70, 0.15)' : 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: isDarkMode ? '#b0b0b0' : '#666666'
            }
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: isDarkMode ? '#b0b0b0' : '#666666',
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: isDarkMode ? '#e0e0e0' : '#333333',
              font: {
                size: 12
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
  }, [data, labelKey, valueKey, label, isDarkMode]);

  if (!data || data.length === 0) {
    return <div className="no-data-message">No data available</div>;
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LineChart;
