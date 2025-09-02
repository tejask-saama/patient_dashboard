import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

const severityColors = {
  'Mild': '#4ADE80',     // green
  'Moderate': '#FBBF24', // yellow
  'Severe': '#F87171',   // red
  'Critical': '#EF4444', // bright red
  'Unknown': '#94A3B8'   // gray
};

const defaultColors = ['#F87171', '#FBBF24', '#4ADE80', '#60A5FA', '#A78BFA'];

const EventSeverityChart = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data || []}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
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
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            formatter={(value) => [`${value} events`, '']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {(data || []).map((entry, index) => {
              const color = severityColors[entry.label] || defaultColors[index % defaultColors.length];
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default EventSeverityChart;
