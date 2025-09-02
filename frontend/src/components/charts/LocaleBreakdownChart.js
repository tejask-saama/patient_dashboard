import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd'];

const LocaleBreakdownChart = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const formattedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: item.locale,
      value: item.count
    }));
  }, [data]);

  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          />
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LocaleBreakdownChart;
