import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        bg="white"
        p="3"
        borderRadius="md"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.100"
      >
        <Text fontWeight="bold">{label}</Text>
        <Text color="brand.500">
          {`Patients: ${payload[0].value.toLocaleString()}`}
        </Text>
      </Box>
    );
  }
  return null;
};

const AgeDistributionChart = ({ data }) => {
  const areaColor = useColorModeValue("teal.400", "teal.300");
  const gradientStart = useColorModeValue("rgba(45, 212, 191, 0.7)", "rgba(45, 212, 191, 0.5)");
  const gradientEnd = useColorModeValue("rgba(45, 212, 191, 0.1)", "rgba(45, 212, 191, 0.05)");
  
  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data || []}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientStart} stopOpacity={0.8} />
              <stop offset="95%" stopColor={gradientEnd} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
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
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke={areaColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAge)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AgeDistributionChart;
