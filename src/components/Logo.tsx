import React from 'react';
import CustomImage from './custom/CustomImage';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href='/'>
      <div className='flex items-center gap-[0.5rem] text-[16px] font-[500] text-[#DCFC36] uppercase'>
        {/* <CustomImage
          src={'/images/logo.png'}
          alt='err'
          width={50}
          height={50}
        /> */}
        Bling Bling
      </div>
    </Link>
  );
};

export default Logo;
