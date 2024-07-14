import Link from 'next/link';
import React from 'react';
import CustomImage from './custom/CustomImage';
import CustomButton from './custom/CustomButton';
import { useRouter } from 'next/navigation';

const CardMint = ({ data }: any) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push('/?section=mint');
      }}
      className='p-[12px] rounded-2xl bg-[#E6EBF8] border border-[#B2C1EB] text-[#0538BD] group cursor-pointer'
    >
      <div className='aspect-square w-full relative overflow-hidden rounded-2xl'>
        <CustomImage
          src={
            data?.image ||
            'https://i.seadn.io/s/raw/files/af7296d9d79348b19bfdb151f5698cb7.gif?auto=format&dpr=1&w=1000'
          }
          fill
          alt='Nft'
          className='object-cover w-full rounded-2xl group-hover:scale-110 transition-all duration-500 ease-in-out'
        />
      </div>
      <div className='my-[16px]'>
        <p className='text-[18px] uppercase font-[400] truncate'>
          {data?.name || 'NFT Name'}
        </p>
        <div className='flex items-center gap-[12px] mt-[12px]  font-[300] text-[16px]'>
          <p className='text-[#587AD3]'>Price</p>
          <p className='text-[18px] font-[400]'>{data?.price || 'FREE'}</p>
        </div>
      </div>
      <CustomButton className='btn-secondary w-full'>Mint</CustomButton>
    </div>
  );
};

export default CardMint;
