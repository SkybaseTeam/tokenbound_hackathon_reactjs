'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Play = () => {
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const router = useRouter();

  return (
    <div className=''>
      <ModalTbaDetail
        open={openModalTbaDetail}
        onCancel={() => {
          setOpenModalTbaDetail(false);
        }}
        showBuy={false}
        selectedNFT={selectedNFT}
      />
      <div className='py-[8rem] layout-container font-glancyr flex flex-col items-center'>
        <h1 className='text-[48px]'>
          Select your Token-Bound Account to Play game!
        </h1>
        <div className='grid extra-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[40px] gap-[16px] w-full'>
          {true ? (
            [...Array(5)]?.map((item: any, index: any) => (
              <div key={item?._id || index}>
                <div className='p-[12px] rounded-2xl border border-[#EFFEA3] bg-[#FBFDEB] text-[#031F68]'>
                  <div
                    className=' group cursor-pointer'
                    onClick={() => {
                      setSelectedNFT(item);
                      setOpenModalTbaDetail(true);
                    }}
                  >
                    <div className='aspect-square w-full relative overflow-hidden rounded-2xl'>
                      <CustomImage
                        src='/images/default.webp'
                        fill
                        alt='Nft'
                        className='object-cover w-full rounded-2xl group-hover:scale-110 transition-all duration-500 ease-in-out'
                      />
                    </div>
                    <div className='my-[16px]'>
                      <p className='text-[18px] uppercase font-[400] truncate'>
                        {'NFT Name'}
                      </p>
                    </div>
                  </div>

                  <CustomButton
                    onClick={() => {
                      router.push(`/play/${1}`);
                    }}
                    className='btn-primary w-full'
                  >
                    Join Game
                  </CustomButton>
                </div>
              </div>
            ))
          ) : (
            <NftSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Play;
