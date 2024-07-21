'use client';

import IconPower from '@/assets/icons/IconPower';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import ImageSkeleton from '@/components/custom/CustomSkeleton/ImageSkeleton';
import RankItem from '@/components/RankItem';
import { useStore } from '@/context/store';
import { fetchNft } from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import { feltToInt, rankMapping } from '@/utils';
import { Skeleton } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EquippedItem from './EquippedItem';
import Tab from '@/components/Tab';
import { useAccount, useProvider } from '@starknet-react/core';
import { cairo, CallData } from 'starknet';
import { toastError } from '@/utils/toast';

const Inventory = () => {
  const {
    accessToken,
    tbaLoginData,
    connectWallet,
    setShowModalWaitTransaction,
  } = useStore();
  const { isMounted } = useMounted();
  const router = useRouter();
  const [nftItemList, setNftItemList] = useState<any>();
  const [activeTab, setActiveTab] = useState<any>('all');
  const [equippedItem, setEquippedItem] = useState<{
    hair: any;
    nose: any;
    mouth: any;
    eye: any;
    eyebrows: any;
    extras: any;
  }>();
  const searchParams = useSearchParams();
  const { isConnected, account } = useAccount();
  const [loading, setLoading] = useState(false);
  const { provider } = useProvider();
  const [selectedNft, setSelectedNft] = useState<any>();

  const getNftItemList = async (filter?: any) => {
    const res = await fetchNft({
      tbaAddress: tbaLoginData?.tba_address,
      ...filter,
    });
    setNftItemList(res?.data?.data);
  };

  const tabData = [
    { id: 1, title: 'All', type: undefined },
    { id: 2, title: 'Hair', type: 0 },
    { id: 3, title: 'Nose', type: 1 },
    { id: 4, title: 'Mouth', type: 2 },
    { id: 5, title: 'Eye', type: 3 },
    { id: 6, title: 'Eyebrows', type: 4 },
    { id: 7, title: 'Extras', type: 5 },
  ];

  useEffect(() => {
    const currentTab = searchParams?.get('tab');
    if (searchParams?.get('tab')) {
      setActiveTab(currentTab?.toLocaleLowerCase());
    }
    if (isMounted && tbaLoginData?.tba_address) {
      getNftItemList({
        type: tabData.find((item) => item.title.toLowerCase() === currentTab)
          ?.type,
      });
    }
  }, [searchParams, isMounted, tbaLoginData?.tba_address]);

  useEffect(() => {
    if (nftItemList) {
      nftItemList?.map((item: any) => {
        if (item?.equip) {
          switch (item?.nft_type) {
            case 0:
              setEquippedItem((prev: any) => ({ ...prev, hair: item }));
              break;
            case 1:
              setEquippedItem((prev: any) => ({ ...prev, nose: item }));
              break;
            case 2:
              setEquippedItem((prev: any) => ({ ...prev, mouth: item }));
              break;
            case 3:
              setEquippedItem((prev: any) => ({ ...prev, eye: item }));
              break;
            case 4:
              setEquippedItem((prev: any) => ({ ...prev, eyebrows: item }));
              break;
            case 5:
              setEquippedItem((prev: any) => ({ ...prev, extras: item }));
              break;
          }
        }
      });
    }
  }, [nftItemList]);

  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }
  }, []);

  const onEquip = async (item: any) => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);
    try {
      // mint Item
      console.log(item?.token_id);
      const tx = await account?.execute([
        {
          contractAddress: tbaLoginData?.tba_address,
          entrypoint: 'equip_item',
          calldata: CallData.compile({
            contract_address: process.env.NEXT_PUBLIC_ERC721_ITEM as string,
            token_id: cairo.uint256(item?.token_id),
          }),
        },
      ]);

      setShowModalWaitTransaction(true);
      const data: any = await provider.waitForTransaction(
        tx?.transaction_hash as any
      );
      console.log(data);
      const tokenId = feltToInt({
        low: parseInt(data?.events[4]?.data[0]),
        high: parseInt(data?.events[4]?.data[1]),
      });
      console.log('TokenId', tokenId);
      const nftMinted: any = await Promise.allSettled([
        // refreshNftMintStatus({
        //   token_id: tokenId,
        //   collection_address: process.env.NEXT_PUBLIC_ERC721_ITEM,
        // }),
        // getDcoin(),
        // getRemainingPool(),
      ]);
      // setMintedNft(nftMinted[0]?.value?.data?.data);
      // setShowModalMintTbaSuccess(true);
    } catch (error) {
      toastError('Equip failed, try reconnect your wallet!');
      console.log(error);
    } finally {
      setLoading(false);
      setShowModalWaitTransaction(false);
    }
  };

  return (
    accessToken && (
      <div className='layout-container pb-[7rem] pt-[5rem] sm:py-[6rem]'>
        <div className='mt-[2rem] flex max-lg:flex-col gap-[2rem]'>
          <div className='basis-1/3 max-lg:order-2'>
            <p className='text-[48px] font-[500] mt-[1rem] flex items-center justify-center gap-[1rem]'>
              <IconPower width={48} height={48} /> {tbaLoginData?.power}
            </p>
            {/* start */}
            <div className='flex items-center gap-[1rem]'>
              <div className='flex flex-col gap-[1rem]'>
                <div className='aspect-square relative w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'>
                  {equippedItem?.hair ? (
                    <EquippedItem data={equippedItem?.hair} />
                  ) : (
                    'Hair'
                  )}
                </div>
                <div className='aspect-square relative w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'>
                  {equippedItem?.nose ? (
                    <EquippedItem data={equippedItem?.nose} />
                  ) : (
                    'Nose'
                  )}
                </div>{' '}
                <div className='aspect-square relative w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'>
                  {equippedItem?.mouth ? (
                    <EquippedItem data={equippedItem?.mouth} />
                  ) : (
                    'Mouth'
                  )}
                </div>
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
                <div className='aspect-square relative w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'>
                  {equippedItem?.eye ? (
                    <EquippedItem data={equippedItem?.eye} />
                  ) : (
                    'Eyes'
                  )}
                </div>
                <div className='aspect-square relative w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'>
                  {equippedItem?.eyebrows ? (
                    <EquippedItem data={equippedItem?.eyebrows} />
                  ) : (
                    'Eyebrows'
                  )}
                </div>
                <div className='aspect-square relative w-[7rem] text-[#546678] flex items-center justify-center bg-white rounded-2xl'>
                  {equippedItem?.extras ? (
                    <EquippedItem data={equippedItem?.extras} />
                  ) : (
                    'Extras'
                  )}
                </div>
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
            <h1 className='text-[36px] font-[500] text-[#0538BD]'>
              My Inventory
            </h1>
            <div className='pb-[24px] pt-[12px]'>
              <Tab tabData={tabData} activeTab={activeTab} />
            </div>

            <div className='grid sm:grid-cols-4 lg:grid-cols-5 gap-[12px]'>
              {nftItemList !== undefined ? (
                nftItemList?.length > 0 ? (
                  nftItemList?.map((item: any, index: any) => (
                    <div
                      key={item?._id}
                      onClick={() => {
                        setSelectedNft(item);
                      }}
                      className='group relative rounded-2xl'
                    >
                      <div className='group-hover:flex hidden flex-col items-center gap-[0.5rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999]'>
                        {item?.equip ? (
                          <CustomButton className='btn-primary'>
                            Unequip
                          </CustomButton>
                        ) : (
                          <CustomButton
                            onClick={() => {
                              onEquip(item);
                            }}
                            className='btn-primary'
                            loading={loading}
                          >
                            Equip
                          </CustomButton>
                        )}
                        <CustomButton className='btn-secondary  '>
                          Detail
                        </CustomButton>
                      </div>

                      <div className='group-hover:blur-sm relative transition-all flex flex-col cursor-pointer'>
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
                              className='rounded-t-2xl'
                              alt='err'
                            />
                          </div>
                        ) : (
                          <ImageSkeleton />
                        )}

                        <div className='bg-[#F4FEC1] rounded-b-2xl'>
                          <p className='text-[18px] font-[400] px-[8px] py-[6px] text-[#031F68] flex items-center justify-center gap-[0.5rem]'>
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
                [...new Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className='rounded-lg flex flex-col items-center gap-[1rem]'
                  >
                    <Skeleton.Button
                      shape='square'
                      active
                      className='aspect-square !w-full rounded-lg skeleton-image'
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
