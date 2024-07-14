import React, { useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import IconVerified from '@/assets/icons/IconVerified';
import CustomButton from '../custom/CustomButton';
import { useAccount, useProvider } from '@starknet-react/core';
import { formatWallet } from '@/utils';

const ModalTbaDetail = ({
  open,
  onCancel,
  selectedNFT,
  setOpenModalBuyNTF,
  showBuy = true,
}: any) => {
  const { isConnected, account, address } = useAccount();

  return (
    <CustomModal width={1205} open={open} onCancel={onCancel}>
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68] max-lg:max-h-[80vh] overflow-auto max-sm:py-[2rem]'>
        <h2 className='text-[48px] font-[500] text-[#031F68]'>
          {selectedNFT?.tba_name}
        </h2>
        <div className='mt-[20px] flex items-start gap-[40px] max-lg:flex-col'>
          <div className='lg:basis-1/2 w-full relative aspect-square'>
            <CustomImage
              src={selectedNFT?.tba_image}
              fill
              alt='err'
              className='rounded-2xl'
            />
          </div>

          <div className='lg:basis-1/2 w-full'>
            <div className='grid grid-cols-2 gap-[5rem]'>
              <div className='text-[18px] font-[300] text-[#546678]'>
                Token-Bound Address
                <p className='mt-[8px] font-[400] text-[24px] text-[#031F68]'>
                  {formatWallet(selectedNFT?.tba_address)}
                </p>
              </div>
              <div className='text-[18px] font-[300] text-[#546678]'>
                Owner
                <p className='mt-[8px] font-[400] text-[24px] text-[#031F68]'>
                  {formatWallet(selectedNFT?.owner_address)}
                </p>
              </div>
            </div>

            {showBuy && (
              <div className='p-[16px] rounded-2xl bg-[#0538BD] max-extra-sm:flex-col max-extra-sm:items-start flex items-end justify-between  mt-[24px]'>
                <div className=''>
                  <p className='text-[18px] font-[300] text-white'>Price</p>
                  <p className='mt-[8px] text-[32px] font-[400] text-[#DCFC36]'>
                    {selectedNFT?.price} BLING
                  </p>
                </div>
                <CustomButton
                  onClick={() => {
                    setOpenModalBuyNTF(true);
                  }}
                  className='btn-primary w-[181px] max-extra-sm:mt-[1rem]'
                >
                  Buy Now
                </CustomButton>
              </div>
            )}

            <div className='mt-[40px]'>
              <p className='text-[24px] text-[#546678]'>Items</p>
              <div className='grid sm:grid-cols-2 gap-[16px] mt-[16px]'>
                {selectedNFT?.nfts?.map((item: any) => (
                  <a
                    href='https://starkscan.co/'
                    target='_blank'
                    className='bg-[#F4FEC1] p-[16px] rounded-2xl flex items-center gap-[12px] cursor-pointer hover:translate-y-[-0.5rem] transition-all'
                    key={item?.id}
                  >
                    <CustomImage
                      src='/images/default.webp'
                      width={68}
                      height={68}
                      className='rounded-2xl'
                      alt='err'
                    />
                    <div>
                      <p className='text-[18px] font-[300] text-[#546678]'>
                        NFT
                      </p>
                      <p className='mt-[8px] text-[24px] font-[400] text-[#0538BD]'>
                        {item?.name}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalTbaDetail;
