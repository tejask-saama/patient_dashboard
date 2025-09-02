import { extendTheme } from '@chakra-ui/react';

// Customize the Chakra UI theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b8e7ff',
      200: '#8ad7ff',
      300: '#5cc6ff',
      400: '#2eb5ff',
      500: '#0099e6',
      600: '#007ab8',
      700: '#005c8a',
      800: '#003d5c',
      900: '#001e2e',
    },
    accent: {
      50: '#e6f9f2',
      100: '#ccf3e5',
      200: '#99e8cb',
      300: '#66dcb1',
      400: '#33d097',
      500: '#00c47d',
      600: '#009d64',
      700: '#00764b',
      800: '#004e32',
      900: '#002719',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: 'md',
      },
    },
    Card: {
      baseStyle: {
        p: '4',
        borderRadius: 'lg',
        boxShadow: 'sm',
      },
    },
  },
});

export default theme;
