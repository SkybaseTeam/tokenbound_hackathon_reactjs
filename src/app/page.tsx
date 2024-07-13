'use client';

import CustomImage from '@/components/custom/CustomImage';
import Intro from '@/components/section/Intro';
import Mint from '@/components/section/Mint';
import bg from '../../public/images/bg.webp';
import Marketplace from '@/components/section/Marketplace';
import Why from '@/components/section/Why';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParam = useSearchParams();
  useEffect(() => {
    const section = searchParam.get('section');
    if (section === 'mint') {
      document
        .getElementById('mint_section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParam]);

  return (
    <div className='bg-[url("/images/bg.webp")] bg-center bg-cover bg-no-repeat bg-fixed'>
      {/* <CustomImage
        src={bg}
        alt='err'
        className='w-full h-screen fixed inset-0 z-[-1]'
      /> */}
      <Intro />
      <Mint />
      <Marketplace />
      <Why />
    </div>
  );
}
