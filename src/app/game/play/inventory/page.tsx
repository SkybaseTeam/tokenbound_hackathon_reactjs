'use client';

import { useStore } from '@/context/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Inventory = () => {
  const { accessToken } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }
  }, []);
  return (
    accessToken && (
      <div className='layout-container py-[4rem] sm:py-[6rem]'>Inventory</div>
    )
  );
};

export default Inventory;
