import React from 'react';
import Header from './Header';

const LayoutGame = ({ children }: any) => {
  return (
    <div className='bg-[url("/images/bg-game.webp")] bg-center bg-cover bg-no-repeat bg-fixed min-h-[100vh]'>
      <Header />
      {children}
    </div>
  );
};

export default LayoutGame;
