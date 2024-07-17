import React from 'react';
import CustomImage from './custom/CustomImage';
import Link from 'next/link';

const Logo = () => {
  return (
    <div className='flex items-center gap-[0.5rem] text-[16px] font-[500] text-[#DCFC36] uppercase'>
      {/* <CustomImage
        src={'/images/token/bling.webp'}
        alt='err'
        width={42}
        height={42}
      /> */}
      <Link href='/' className='sm:hidden'>
        <p>Bling Bling</p>
      </Link>

      <Link href='/' className='max-sm:hidden'>
        <CustomImage
          src={'/images/logo2.webp'}
          alt='err'
          width={268}
          height={50}
        />
      </Link>
    </div>
  );
};

export default Logo;
