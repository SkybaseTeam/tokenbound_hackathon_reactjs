import React from 'react';
import CustomImage from './custom/CustomImage';
import CustomButton from './custom/CustomButton';
import { useAccount } from '@starknet-react/core';
import { useStore } from '@/context/store';
import { formatToken } from '@/utils';
import { usePathname } from 'next/navigation';

const CardMarketplace = ({
  setOpenModalBuyNTF,
  data,
  setSelectedNFT,
  setOpenModalTbaDetail = () => {},
  setOpenModalCancelListNFT = () => {},
  ...props
}: any) => {
  const { isConnected, address } = useAccount();
  const { connectWallet } = useStore();
  const path = usePathname();
  return (
    <div
      {...props}
      className='p-[12px] rounded-2xl border border-[#EFFEA3] bg-[#FBFDEB] text-[#031F68] '
    >
      <div
        onClick={() => {
          setSelectedNFT(data);
          setOpenModalTbaDetail(true);
        }}
        className='group cursor-pointer'
      >
        <div className='aspect-square w-full relative overflow-hidden rounded-2xl '>
          <CustomImage
            placeholder='blur'
            blurDataURL='/images/default.webp'
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
          <div className='flex items-center gap-[12px] mt-[12px]  font-[300] text-[16px]'>
            <p className='text-[#546678]'>Price</p>
            <p className='text-[18px] font-[400]'>{data?.price || ''} BLING</p>
          </div>
        </div>
      </div>
      {path === '/' && (
        <CustomButton className='btn-primary w-full'>Go to Market</CustomButton>
      )}
      {path !== '/' &&
        (data?.owner_address !== address ? (
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
        ) : (
          <CustomButton
            onClick={() => {
              if (!isConnected) {
                connectWallet();
                return;
              }
              setSelectedNFT(data);
              setOpenModalCancelListNFT(true);
            }}
            className='btn-primary w-full'
          >
            Cancel List
          </CustomButton>
        ))}
    </div>
  );
};

export default CardMarketplace;
