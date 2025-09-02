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

const AgeByCountryChart = ({ data }) => {
  const barColor = useColorModeValue('#3b82f6', '#60a5fa'); // Blue color
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Transform data if needed
  const formattedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      label: item.country,
      value: parseFloat(item.avg_age).toFixed(1)
    }));
  }, [data]);

  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
          <XAxis 
            type="number"
            tick={{ fontSize: 12, fill: '#718096' }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12, fill: '#718096' }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            formatter={(value) => [`${value} years`, '']}
          />
          <Bar dataKey="value" fill={barColor} radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AgeByCountryChart;
