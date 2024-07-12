import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const Footer = () => {
  const path = usePathname();

  return <div className='h-[212px]'></div>;
};

export default Footer;
