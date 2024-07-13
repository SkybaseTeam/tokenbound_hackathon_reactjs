import React, { useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import IconVerified from '@/assets/icons/IconVerified';
import CustomButton from '../custom/CustomButton';
import { useAccount, useProvider } from '@starknet-react/core';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { formatWallet } from '@/utils';

const ModalTbaDetail = ({
  open,
  onCancel,
  selectedNFT,
  setOpenModalBuyNTF,
  showBuy = true,
}: any) => {
  const [text, copy] = useCopyToClipboard();
  const { isConnected, account, address } = useAccount();

  return (
    <CustomModal width={1205} open={open} onCancel={onCancel}>
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68]'>
        <h2 className='text-[48px] font-[500] text-[#031F68]'>
          {selectedNFT?.name}
        </h2>
        <div className='mt-[20px] flex items-start gap-[40px]'>
          <CustomImage
            src={selectedNFT?.image}
            width={505}
            height={505}
            alt='err'
            className='rounded-2xl'
          />
          <div className='flex-1'>
            <div className='grid grid-cols-2 gap-[5rem]'>
              <div className='text-[18px] font-[300] text-[#546678]'>
                Token-Bound Address
                <p className='mt-[8px] font-[400] text-[24px] text-[#031F68]'>
                  TBA Address
                </p>
              </div>
              <div className='text-[18px] font-[300] text-[#546678]'>
                Owner
                <p className='mt-[8px] font-[400] text-[24px] text-[#031F68]'>
                  {formatWallet(address)}
                </p>
              </div>
            </div>

            {showBuy && (
              <div className='p-[16px] rounded-2xl bg-[#0538BD] flex items-end justify-between  mt-[24px]'>
                <div className=''>
                  <p className='text-[18px] font-[300] text-white'>Price</p>
                  <p className='mt-[8px] text-[32px] font-[400] text-[#DCFC36]'>
                    20 BLING
                  </p>
                </div>
                <CustomButton
                  onClick={() => {
                    setOpenModalBuyNTF(true);
                  }}
                  className='btn-primary w-[181px]'
                >
                  Buy Now
                </CustomButton>
              </div>
            )}

            <div className='mt-[40px]'>
              <p className='text-[24px] text-[#546678]'>Items</p>
              <div className='grid grid-cols-2 gap-[16px] mt-[16px]'>
                {[...Array(4)].map((_, index) => (
                  <a
                    href='https://starkscan.co/'
                    target='_blank'
                    className='bg-[#F4FEC1] p-[16px] rounded-2xl flex items-center gap-[12px] cursor-pointer hover:translate-y-[-0.5rem] transition-all'
                    key={index}
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
                        Body
                      </p>
                      <p className='mt-[8px] text-[24px] font-[400] text-[#0538BD]'>
                        Muscular
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
