import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LayoutPrimary = ({ children }: any) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default LayoutPrimary;
