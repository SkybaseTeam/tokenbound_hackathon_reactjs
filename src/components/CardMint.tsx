import Link from 'next/link';
import React from 'react';
import CustomImage from './custom/CustomImage';
import CustomButton from './custom/CustomButton';

const CardMint = ({ data }: any) => {
  return (
    <div className='p-[12px] rounded-2xl bg-[#E6EBF8] border border-[#B2C1EB] text-[#0538BD] group cursor-pointer'>
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
          <p className='text-[#587AD3]'>Price</p>
          <p className='text-[18px] font-[400]'>{data?.price || ''} BLING</p>
        </div>
      </div>
      <CustomButton
        // onClick={() => {
        //   if (!isConnected) {
        //     connectWallet();
        //     return;
        //   }
        //   setSelectedNFT(data);
        //   setOpenModalBuyNTF(true);
        // }}
        className='btn-secondary w-full'
      >
        Mint
      </CustomButton>
    </div>
  );
};

export default CardMint;
