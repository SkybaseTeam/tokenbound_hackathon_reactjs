'use client';

import CustomImage from '@/components/custom/CustomImage';
import Intro from '@/components/section/Intro';
import Mint from '@/components/section/Mint';
import bg from '../../public/images/bg.webp';
import Marketplace from '@/components/section/Marketplace';
import Why from '@/components/section/Why';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// import Aos from 'aos';
// import 'aos/dist/aos.css';

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

  // useEffect(() => {
  //   Aos.init({
  //     duration: 1000,
  //     once: true,
  //   });
  // }, []);

  return (
    <div className=''>
      <Intro />
      <Mint />
      <Marketplace />
      <Why />
    </div>
  );
}
