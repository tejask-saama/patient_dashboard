import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

const BmiByMaritalStatusChart = ({ data }) => {
  const barColor = useColorModeValue('#6366f1', '#818cf8'); // Indigo color
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Transform data if needed
  const formattedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      label: item.marital_status,
      value: parseFloat(item.avg_bmi).toFixed(1)
    }));
  }, [data]);

  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12, fill: '#718096' }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#718096' }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
            label={{ value: 'Average BMI', angle: -90, position: 'insideLeft', fill: '#718096', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            formatter={(value) => [`${value} BMI`, '']}
          />
          <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BmiByMaritalStatusChart;
