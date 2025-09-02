import React from 'react';
import { 
  Flex, 
  InputGroup, 
  InputLeftElement, 
  Input, 
  IconButton, 
  useColorMode, 
  Box,
  HStack,
  useMediaQuery,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  Badge,
  Tooltip
} from '@chakra-ui/react';
import { FiSearch, FiBell, FiSun, FiMoon, FiUser, FiSettings, FiHelpCircle } from 'react-icons/fi';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)');

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px={{ base: '2', md: '4' }}
      py={{ base: '3', md: '2' }}
      bg={"white"}
      borderBottomWidth="1px"
      borderColor={"gray.200"}
      _dark={{ 
        bg: "gray.800",
        borderColor: "gray.700" 
      }}
      h={{ base: '16', md: '14' }}
      position="sticky"
      top={0}
      zIndex={10}
    >
      {isLargerThanMd ? (
        <InputGroup w={{ md: '60', lg: '96' }} display={{ base: 'none', md: 'flex' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search patients, events..." 
            variant="filled"
            _placeholder={{ color: 'gray.400' }}
            bg="gray.50"
            _dark={{ bg: 'gray.700' }}
            _focus={{
              bg: 'gray.50',
              _dark: { bg: 'gray.700' }
            }}
            rounded="md"
          />
        </InputGroup>
      ) : (
        <Box w="40px" /> /* Spacer for mobile */
      )}

      <HStack spacing={{ base: "2", md: "4" }}>
        {!isLargerThanMd && (
          <IconButton
            aria-label="Search"
            icon={<FiSearch />}
            size="sm"
            fontSize="lg"
            variant="ghost"
            color="gray.500"
            _dark={{ color: 'gray.400' }}
          />
        )}
        
        <Tooltip label="Notifications" placement="bottom">
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              size="sm"
              fontSize="lg"
              variant="ghost"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
            />
            <Badge 
              position="absolute" 
              top="0" 
              right="0" 
              colorScheme="red" 
              variant="solid" 
              borderRadius="full" 
              transform="scale(0.7)" 
              boxSize="4"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              3
            </Badge>
          </Box>
        </Tooltip>

        <Tooltip label="Toggle dark mode" placement="bottom">
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            size="sm"
            fontSize="lg"
            onClick={toggleColorMode}
            variant="ghost"
            color="gray.500"
            _dark={{ color: 'gray.400' }}
          />
        </Tooltip>

        <Menu>
          <Tooltip label="User profile" placement="bottom">
            <MenuButton
              as={IconButton}
              size="sm"
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar size="sm" bg="brand.500" color="white" name="Medical Staff" />
            </MenuButton>
          </Tooltip>
          <MenuList zIndex={100}>
            <MenuItem icon={<FiUser />}>Profile</MenuItem>
            <MenuItem icon={<FiSettings />}>Settings</MenuItem>
            <MenuItem icon={<FiHelpCircle />}>Help</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};


export default Header;
