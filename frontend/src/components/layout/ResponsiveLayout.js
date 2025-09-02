import React from 'react';
import { useMediaQuery, Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Responsive Layout component that adjusts based on screen size
 * - On mobile: Full-width header with collapsible sidebar
 * - On desktop: Fixed sidebar with header on right
 */
const ResponsiveLayout = ({ children }) => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)');

  return (
    <Box display="flex" flexDirection={isLargerThanMd ? 'row' : 'column'} h="100vh">
      {/* Sidebar - fixed on desktop, toggleable on mobile */}
      <Sidebar isMobile={!isLargerThanMd} />
      
      {/* Main content area */}
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        transition="all 0.2s"
      >
        {/* Header - always visible */}
        <Header />
        
        {/* Main content - scrollable */}
        <Box
          flex="1"
          overflowY="auto"
          p={{ base: 2, md: 4 }}
          bg="gray.50"
          _dark={{ bg: 'gray.900' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ResponsiveLayout;
