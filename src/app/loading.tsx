'use client';

import CustomImage from '@/components/custom/CustomImage';
import React from 'react';

const Loading = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0538BD]'>
      <CustomImage
        src='/images/token/bling-big.webp'
        alt='loading'
        className='animate-bounce'
        width={100}
        height={100}
      />
      <p className='text-[30px] font-[500] mt-[20px]'>Loading...</p>
    </div>
  );
};

export default Loading;
