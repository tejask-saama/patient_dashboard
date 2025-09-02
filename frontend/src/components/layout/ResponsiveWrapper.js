import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';

const ResponsiveWrapper = ({ children, className = '' }) => {
  const padding = useBreakpointValue({ base: '4', md: '6', lg: '8' });
  
  return (
    <Box 
      p={padding} 
      className={`fade-in ${className}`}
      width="full"
    >
      {children}
    </Box>
  );
};

export default ResponsiveWrapper;
