import React from 'react';
import Header from './Header';

const LayoutGame = ({ children }: any) => {
  return (
    <div className=''>
      <Header />
      {children}
    </div>
  );
};

export default LayoutGame;
