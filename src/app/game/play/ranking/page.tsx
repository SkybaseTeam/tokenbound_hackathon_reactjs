'use client';

import { useStore } from '@/context/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Ranking = () => {
  const { accessToken } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }
  }, []);
  return (
    accessToken && (
      <div className='layout-container py-[4rem] sm:py-[6rem]'>Ranking</div>
    )
  );
};

export default Ranking;
