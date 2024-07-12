import React from 'react';
import CustomImage from './custom/CustomImage';
import CustomButton from './custom/CustomButton';
import { useAccount } from '@starknet-react/core';
import { useStore } from '@/context/store';
import { formatToken } from '@/utils';

const CardMarketplace = ({ setOpenModalBuyNTF, data, setSelectedNFT }: any) => {
  const { isConnected } = useAccount();
  const { connectWallet } = useStore();
  return (
    <div className='p-[12px] rounded-2xl bg-white text-[#031F68] group cursor-pointer'>
      <div className='aspect-square w-full relative overflow-hidden rounded-2xl'>
        <CustomImage
          src={data?.image}
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
          <p className='text-[#546678]'>Price</p>
          <p className='text-[18px] font-[400]'>{data?.price || ''} BLING</p>
        </div>
      </div>
      <CustomButton
        onClick={() => {
          if (!isConnected) {
            connectWallet();
            return;
          }
          setSelectedNFT(data);
          setOpenModalBuyNTF(true);
        }}
        className='btn-primary w-full'
      >
        Buy
      </CustomButton>
    </div>
  );
};

export default CardMarketplace;
