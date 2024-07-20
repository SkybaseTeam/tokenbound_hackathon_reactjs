'use client';

import IconPower from '@/assets/icons/IconPower';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import ImageSkeleton from '@/components/custom/CustomSkeleton/ImageSkeleton';
import RankItem from '@/components/RankItem';
import { useStore } from '@/context/store';
import { fetchNft } from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import { rankMapping } from '@/utils';
import { Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Inventory = () => {
  const { accessToken, tbaLoginData } = useStore();
  const { isMounted } = useMounted();
  const router = useRouter();
  const [nftItemList, setNftItemList] = useState<any>();

  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }
  }, []);

  useEffect(() => {
    const getNftItemList = async () => {
      const res = await fetchNft(tbaLoginData?.tba_address);
      setNftItemList(res?.data?.data);
    };
    if (isMounted && tbaLoginData?.tba_address) {
      getNftItemList();
    }
  }, [isMounted, tbaLoginData]);

  return (
    accessToken && (
      <div className='layout-container pb-[7rem] pt-[5rem] sm:py-[6rem]'>
        <h1 className='text-[48px] font-[500] text-[#DCFC36]'>My Inventory</h1>
        <div className='mt-[2rem] flex max-lg:flex-col gap-[2rem]'>
          <div className='basis-1/3 max-lg:order-2'>
            <p className='text-[48px] font-[500] mt-[1rem] flex items-center justify-center gap-[1rem]'>
              <IconPower width={48} height={48} /> {tbaLoginData?.power}
            </p>
            {/* start */}
            <div className='flex items-center gap-[1rem]'>
              <div className='flex flex-col gap-[1rem]'>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className='aspect-square w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'
                  >
                    asd
                  </div>
                ))}
              </div>

              <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[20rem]'>
                <div className='aspect-square relative rounded-2xl'>
                  <CustomImage
                    src={tbaLoginData?.tba_image}
                    className='rounded-2xl'
                    alt='err'
                    fill
                  />
                </div>
              </div>

              <div className='flex flex-col gap-[1rem]'>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className='aspect-square w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'
                  >
                    asd
                  </div>
                ))}
              </div>
            </div>

            {/* end */}
            <div className='flex justify-center mt-[1rem]'>
              <CustomButton
                className='btn-primary w-[190px] uppercase'
                disabled
              >
                Confirm
              </CustomButton>
            </div>
          </div>

          <div className='basis-2/3 bg-white rounded-[16px] p-[16px] items-start'>
            <div className='grid sm:grid-cols-4 lg:grid-cols-5 gap-[12px]'>
              {nftItemList !== undefined ? (
                nftItemList?.length > 0 ? (
                  nftItemList?.map((item: any, index: any) => (
                    <div key={item?._id} className='group relative'>
                      <div className='group-hover:flex hidden flex-col items-center gap-[0.5rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999]'>
                        <CustomButton className='btn-primary  '>
                          Equip
                        </CustomButton>
                        <CustomButton className='btn-secondary  '>
                          Detail
                        </CustomButton>
                      </div>

                      <div className='group-hover:blur-sm bg-[#E6EBF8] border border-[#B2C1EB] p-[8px] relative transition-all rounded-2xl flex flex-col gap-[12px] cursor-pointer '>
                        <div className='absolute top-0 left-0 z-[99]'>
                          <RankItem
                            data={{
                              rank: rankMapping(item?.nft_rank).rank,
                              bg: rankMapping(item?.nft_rank).bg,
                            }}
                            className='!w-[24px] !h-[24px] !text-[12px] !leading-[24px]'
                          />
                        </div>

                        {item?.nft_image ? (
                          <div className='aspect-square relative'>
                            <CustomImage
                              src={item?.nft_image}
                              placeholder='blur'
                              blurDataURL='/images/default.webp'
                              fill
                              className='rounded-xl'
                              alt='err'
                            />
                          </div>
                        ) : (
                          <ImageSkeleton />
                        )}

                        <div className='overflow-hidden'>
                          <p className='text-[18px] mt-[8px]  font-[300] text-[#546678] flex items-center gap-[0.5rem]'>
                            <span className='flex items-center'>
                              <IconPower /> {item?.power}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-[#031F68]'>No Data!</div>
                )
              ) : (
                [...new Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className='w-full rounded-lg flex items-center gap-[1rem]'
                  >
                    <Skeleton.Button
                      shape='square'
                      active
                      className='aspect-square !w-[5rem] rounded-lg skeleton-image'
                      block
                    />
                    <div className='mt-2 space-y-2 w-full'>
                      <div className='w-full'>
                        <Skeleton.Button size='small' active block />
                      </div>
                      <div className='w-4/6'>
                        <Skeleton.Button size='small' active block />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Inventory;
