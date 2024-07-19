import Link from 'next/link';
import React from 'react';
import CustomImage from './custom/CustomImage';
import CustomButton from './custom/CustomButton';
import { useRouter } from 'next/navigation';
import IconPower from '@/assets/icons/IconPower';

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
          placeholder='blur'
          blurDataURL='/images/default.webp'
          src={
            'https://i.seadn.io/s/raw/files/af7296d9d79348b19bfdb151f5698cb7.gif?auto=format&dpr=1&w=1000'
          }
          fill
          alt='Nft'
          className='object-cover w-full rounded-2xl group-hover:scale-110 transition-all duration-500 ease-in-out'
        />
      </div>
      <div className='my-[16px]'>
        <p className='text-[18px] uppercase font-[400] truncate'>
          {'ERC-6551 Token-bound Account'}
        </p>
        <div className='grid grid-cols-2 p-[12px] bg-[#CCD7F4] rounded-2xl mt-[12px] '>
          <div className='font-[300] text-[16px]'>
            <p className='text-[#3760CA]'>Power</p>
            <p className='text-[18px] font-[400] mt-[4px]'>
              <div className='flex items-center gap-[6px]'>
                <IconPower />0
              </div>
            </p>
          </div>
          <div className='font-[300] text-[16px]'>
            <p className='text-[#3760CA]'>Price</p>
            <p className='text-[18px] font-[400] mt-[4px]'>
              FREE
            </p>
          </div>
        </div>
      </div>
      <CustomButton className='btn-secondary w-full'>Mint</CustomButton>
    </div>
  );
};

export default CardMint;
