import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import CustomButton from '../custom/CustomButton';
import { formatWallet, rankMapping } from '@/utils';
import CustomTooltip from '../custom/CustomTooltip';
import { useRouter } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import ImageSkeleton from '../custom/CustomSkeleton/ImageSkeleton';
import IconPower from '@/assets/icons/IconPower';

const ModalMintTbaSuccess = ({ open, onCancel, mintedNft }: any) => {
  const router = useRouter();
  const { address } = useAccount();
  const [text, copy] = useCopyToClipboard();

  return (
    <CustomModal width={450} open={open} onCancel={onCancel}>
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68]'>
        <h4 className='text-[48px] font-[500] text-[#031F68] text-center'>
          Success
        </h4>

        <div className='overflow-y-auto scrollbar-custom'>
          <p className='text-center text-[16px] font-[300] mb-[30px]'>
            Your minting was successfully completed!
          </p>
          <div className='relative w-full aspect-square'>
            {mintedNft ? (
              <>
                {' '}
                <CustomImage
                  placeholder='blur'
                  blurDataURL='/images/default.webp'
                  src={mintedNft?.tba_image || mintedNft?.nft_image}
                  alt='nft'
                  className='rounded-2xl w-full'
                  fill
                />
                <div
                  style={{
                    background: rankMapping(mintedNft?.nft_rank).bg,
                  }}
                  className='absolute rounded-full text-[18px] font-[400] w-[48px] h-[48px] top-[-1rem] left-0 text-white flex items-center justify-center'
                >
                  <p className='mt-[0.1rem]'>
                    {rankMapping(mintedNft?.nft_rank).rank}
                  </p>
                </div>
              </>
            ) : (
              <ImageSkeleton />
            )}
          </div>

          <div className='flex flex-col justify-between mt-[14px] '>
            <p className='text-[16px] font-[300] text-[#546678] flex justify-between items-center'>
              Name
              <CustomTooltip
                title='Copied'
                placement='right'
                trigger={['click']}
              >
                <span
                  onClick={() => copy(mintedNft?.tba_name as string)}
                  className='text-[#031F68] text-[24px] font-[400] ml-[0.5rem] cursor-pointer truncate'
                >
                  {mintedNft
                    ? mintedNft?.tba_name || mintedNft?.nft_name
                    : '...'}
                </span>
              </CustomTooltip>
            </p>
            <p className='text-[16px] font-[300] text-[#546678] flex justify-between items-center mt-[6px]'>
              Address
              <CustomTooltip
                title='Copied'
                placement='right'
                trigger={['click']}
              >
                <span
                  onClick={() => copy(mintedNft?.owner_address as string)}
                  className='text-[#031F68] text-[24px] font-[400] ml-[0.5rem] cursor-pointer'
                >
                  {mintedNft
                    ? formatWallet(
                        mintedNft?.tba_address || mintedNft?.collection_address
                      )
                    : '...'}
                </span>
              </CustomTooltip>
            </p>
            {mintedNft?.nft_name && (
              <p className='text-[16px] font-[300] text-[#546678] flex justify-between items-center mt-[6px]'>
                Power
                <span
                  onClick={() => copy(mintedNft?.owner_address as string)}
                  className='text-[#031F68] text-[24px] font-[400] ml-[0.5rem] flex items-center gap-[0.5rem] cursor-pointer'
                >
                  {mintedNft ? mintedNft?.power : '...'}
                  <IconPower />
                </span>
              </p>
            )}
          </div>
        </div>
        <div className='mt-[30px] text-[16px] font-[300] text-[#546678]'>
          Go to My Profile to check your item
          <CustomButton
            onClick={() => {
              router.push('/profile/' + address);
            }}
            className='btn-primary w-full mt-[16px]'
          >
            Go to Profile
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalMintTbaSuccess;
