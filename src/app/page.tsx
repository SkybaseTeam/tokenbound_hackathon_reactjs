'use client';

import CustomImage from '@/components/custom/CustomImage';
import Intro from '@/components/section/Intro';
import Mint from '@/components/section/Mint';
import bg from '../../public/images/bg.webp';
import Marketplace from '@/components/section/Marketplace';
import Why from '@/components/section/Why';

export default function Home() {
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
