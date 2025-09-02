import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const DashboardCard = ({ title, subtitle, children, height = "auto" }) => {
  return (
    <MotionBox
      whileHover={{ y: -4, boxShadow: "lg" }}
      transition={{ duration: 0.2 }}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      p={5}
      h={height}
      boxShadow="sm"
      overflow="hidden"
    >
      <Heading size="md" mb={subtitle ? 1 : 3}>
        {title}
      </Heading>
      {subtitle && (
        <Text color="gray.500" fontSize="sm" mb={3}>
          {subtitle}
        </Text>
      )}
      {children}
    </MotionBox>
  );
};

export default DashboardCard;
