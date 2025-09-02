import React, { useRef, useEffect } from 'react';
import { Box, Text, Heading, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import CountUp from 'react-countup';

const MotionDiv = motion.div;

const MetricCounter = ({
  title,
  value,
  change,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const countUpRef = useRef(null);
  
  return (
    <Box>
      <Text color="gray.500" fontSize="sm" mb={1}>
        {title}
      </Text>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="xl">
          <CountUp
            start={0}
            end={value || 0}
            duration={1.5}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        </Heading>
      </MotionDiv>
      {change !== undefined && (
        <HStack mt={1} spacing={1}>
          <Icon 
            as={change >= 0 ? FiArrowUp : FiArrowDown} 
            color={change >= 0 ? "green.400" : "red.400"} 
          />
          <Text
            fontSize="sm"
            color={change >= 0 ? "green.400" : "red.400"}
            fontWeight="medium"
          >
            {Math.abs(change)}%
          </Text>
        </HStack>
      )}
    </Box>
  );
};

export default MetricCounter;
