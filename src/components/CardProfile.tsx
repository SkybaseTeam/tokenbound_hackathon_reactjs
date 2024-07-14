import React from 'react';
import CustomImage from './custom/CustomImage';
import CustomButton from './custom/CustomButton';
import logo from '../../public/images/logo.webp';
import { useAccount } from '@starknet-react/core';
import { useStore } from '@/context/store';
import IconVerified from '@/assets/icons/IconVerified';

const CardProfile = ({
  setOpenModalListNFT,
  setOpenModalCancelListNFT,
  setOpenModalTbaDetail,
  data,
  setSelectedNFT,
}: any) => {
  const { isConnected } = useAccount();
  const { connectWallet } = useStore();
  return (
    <div className='p-[12px] rounded-2xl border border-[#EFFEA3] bg-[#FBFDEB] text-[#031F68]'>
      <div
        className=' group cursor-pointer'
        onClick={() => {
          setSelectedNFT(data);
          setOpenModalTbaDetail(true);
        }}
      >
        <div className='aspect-square w-full relative overflow-hidden rounded-2xl'>
          <CustomImage
            src={data?.tba_image}
            fill
            alt='Nft'
            className='object-cover w-full rounded-2xl group-hover:scale-110 transition-all duration-500 ease-in-out'
          />
        </div>
        <div className='my-[16px]'>
          <p className='text-[18px] uppercase font-[400] truncate'>
            {data?.tba_name || 'NFT Name'}
          </p>

          <div
            className={` flex items-center gap-[12px] mt-[12px]  font-[300] text-[16px]`}
          >
            <p className='text-[#546678]'>Price</p>
            <p className='text-[18px] font-[400]'>
              {data?.listing ? data?.price + ' BLING' : 'Unlisted'}
            </p>
          </div>
        </div>
      </div>

      <CustomButton
        onClick={() => {
          if (!isConnected) {
            connectWallet();
            return;
          }
          setSelectedNFT(data);
          data?.listing
            ? setOpenModalCancelListNFT(true)
            : setOpenModalListNFT(true);
        }}
        className='btn-primary w-full'
      >
        {data?.listing ? 'Cancel List' : 'List Now'}
      </CustomButton>
    </div>
  );
};

export default CardProfile;
