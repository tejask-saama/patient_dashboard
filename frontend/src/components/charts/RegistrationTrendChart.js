import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

const RegistrationTrendChart = ({ data }) => {
  const lineColor = useColorModeValue('#10b981', '#34d399'); // Green color
  const bgColor = useColorModeValue('white', 'gray.800');

  const formattedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({ name: item.period, count: item.count }));
  }, [data]);

  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#718096' }} />
          <YAxis tick={{ fontSize: 12, fill: '#718096' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            formatter={(value) => [value, 'Registrations']}
          />
          <Line type="monotone" dataKey="count" stroke={lineColor} strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RegistrationTrendChart;
