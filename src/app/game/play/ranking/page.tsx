'use client';

import CardRank from '@/components/CardRank';
import CustomPagination from '@/components/custom/CustomPagination';
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
      <div className='layout-container max-w-[583px] py-[4rem] sm:py-[6rem]'>
        <h1 className='text-[48px] font-[500] text-[#DCFC36]'>RANKING</h1>
        <CardRank />
        <div className='flex justify-center w-full mt-[12px]'>
          {' '}
          <CustomPagination
            showSizeChanger={false}
            defaultCurrent={1}
            total={100}
          />
        </div>
      </div>
    )
  );
};

export default Ranking;
