import React from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  Text, 
  Icon, 
  Link, 
  Heading,
  Divider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiUsers, 
  FiAlertTriangle, 
  FiSettings, 
  FiHelpCircle,
  FiMenu 
} from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NavItem = ({ icon, label, path, isActive, onClick }) => {
  return (
    <Link 
      as={RouterLink} 
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      onClick={onClick}
    >
      <Flex
        align="center"
        p="3"
        mx="-3"
        borderRadius="md"
        role="group"
        cursor="pointer"
        bg={isActive ? 'brand.50' : 'transparent'}
        color={isActive ? 'brand.500' : 'gray.600'}
        _hover={{
          bg: isActive ? 'brand.50' : 'gray.100',
        }}
        _dark={{
          color: isActive ? 'brand.200' : 'gray.300',
          bg: isActive ? 'whiteAlpha.100' : 'transparent',
          _hover: {
            bg: isActive ? 'whiteAlpha.100' : 'whiteAlpha.50',
          }
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          color={isActive ? 'brand.500' : 'gray.500'}
          _dark={{
            color: isActive ? 'brand.200' : 'gray.400'
          }}
        />
        <Text fontSize="md">{label}</Text>
      </Flex>
    </Link>
  );
};

const Sidebar = ({ isMobile = false }) => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const navItems = [
    { label: 'Dashboard', icon: FiHome, path: '/' },
    { label: 'Patient Demographics', icon: FiUsers, path: '/demographics' },
    { label: 'Adverse Events', icon: FiAlertTriangle, path: '/adverse-events' },
    { label: 'Settings', icon: FiSettings, path: '/settings' },
    { label: 'Help', icon: FiHelpCircle, path: '/help' },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo and title */}
      <Flex mb={8} align="center">
        <Box bg="brand.500" w={10} h={10} borderRadius="md" mr={3}></Box>
        <Heading size="md" fontWeight="bold">Health Monitor</Heading>
      </Flex>
      
      {/* Navigation */}
      <VStack spacing={1} align="stretch">
        {navItems.slice(0, 3).map((item) => (
          <NavItem 
            key={item.label} 
            icon={item.icon} 
            label={item.label} 
            path={item.path} 
            isActive={location.pathname === item.path || 
              (item.path === '/' && location.pathname === '/dashboard')}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </VStack>
      
      <Divider my={6} />
      
      {/* Bottom section */}
      <VStack spacing={1} align="stretch">
        {navItems.slice(3).map((item) => (
          <NavItem 
            key={item.label} 
            icon={item.icon} 
            label={item.label} 
            path={item.path} 
            isActive={location.pathname === item.path}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </VStack>
    </>
  );

  // Mobile drawer version
  if (isMobile) {
    return (
      <>
        <IconButton
          icon={<FiMenu />}
          aria-label="Open menu"
          display={{ base: 'flex', md: 'none' }}
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
          onClick={onOpen}
        />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader p={4}></DrawerHeader>
            <DrawerBody p={4}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop sidebar version
  return (
    <Box
      w="250px"
      h="100vh"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      _dark={{
        bg: 'gray.800',
        borderColor: 'gray.700'
      }}
      p={4}
      display={{ base: 'none', md: 'block' }}
    >
      <SidebarContent />
    </Box>
  );
};

export default Sidebar;
