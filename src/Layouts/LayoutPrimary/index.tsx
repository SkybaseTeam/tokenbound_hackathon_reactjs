import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LayoutPrimary = ({ children }: any) => {
  return (
    <div className='bg-[url("/images/bg.webp")]  bg-center bg-cover bg-no-repeat bg-fixed min-h-[var(--100vh)]'>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutPrimary;
