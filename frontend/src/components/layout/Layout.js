import React from 'react';
import ResponsiveLayout from './ResponsiveLayout';

const Layout = ({ children }) => {
  return (
    <ResponsiveLayout>
      {children}
    </ResponsiveLayout>
  );
};

export default Layout;
