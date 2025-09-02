import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0EA5E9', '#F472B6', '#34D399', '#FBBF24', '#A78BFA', '#F87171'];

const GenderDistributionChart = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data || []}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="count"
            nameKey="label"
            label={renderCustomizedLabel}
            animationBegin={0}
            animationDuration={800}
          >
            {(data || []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            formatter={(value, name) => [value, name]}
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GenderDistributionChart;
