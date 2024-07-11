import React from 'react';
import Header from './Header';

const LayoutPrimary = ({ children }: any) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default LayoutPrimary;
