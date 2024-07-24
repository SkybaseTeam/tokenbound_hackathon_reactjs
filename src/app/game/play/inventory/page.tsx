'use client';

import IconPower from '@/assets/icons/IconPower';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import ImageSkeleton from '@/components/custom/CustomSkeleton/ImageSkeleton';
import RankItem from '@/components/RankItem';
import { useStore } from '@/context/store';
import { fetchNft } from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import { deepEqual, feltToInt, rankMapping } from '@/utils';
import { Skeleton } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import EquippedItem from './EquippedItem';
import Tab from '@/components/Tab';
import { useAccount, useProvider } from '@starknet-react/core';
import { cairo, CallData } from 'starknet';
import { toastError, toastSuccess } from '@/utils/toast';
import { refreshEquip } from '@/fetching/client/nft';
import html2canvas from 'html2canvas';
import { uploadTbaImage } from '@/fetching/client/tba';

interface IEquippedItem {
  hair: any;
  nose: any;
  mouth: any;
  eye: any;
  eyebrows: any;
  ears: any;
}

const initEquippedItem: IEquippedItem = {
  hair: '',
  nose: '',
  mouth: '',
  eye: '',
  eyebrows: '',
  ears: '',
};

const Inventory = () => {
  const {
    accessToken,
    tbaLoginData,
    connectWallet,
    setShowModalWaitTransaction,
    getGameProfile,
  } = useStore();
  const { isMounted } = useMounted();
  const router = useRouter();
  const [nftItemList, setNftItemList] = useState<any>();
  const [activeTab, setActiveTab] = useState<any>('all');
  const [equippedItem, setEquippedItem] =
    useState<IEquippedItem>(initEquippedItem);
  const [equippedItemBefore, setEquippedItemBefore] =
    useState<IEquippedItem>(initEquippedItem);
  const searchParams = useSearchParams();
  const { address, account } = useAccount();
  const [loading, setLoading] = useState(false);
  const [loadingNft, setLoadingNft] = useState(false);
  const { provider } = useProvider();
  const [selectedNft, setSelectedNft] = useState<any>();
  const [power, setPower] = useState<any>(0);

  useEffect(() => {
    setPower(tbaLoginData?.power);
  }, [tbaLoginData?.power]);

  const getNftItemList = async (filter?: any) => {
    try {
      setLoadingNft(true);
      const res = await fetchNft({
        tbaAddress: tbaLoginData?.tba_address,
        ...filter,
      });
      setNftItemList(res?.data?.data);
    } catch (err) {
      console.log(err);
      toastError('Get NFT list failed, try reconnect your wallet!');
    } finally {
      setLoadingNft(false);
    }
  };

  const handleSetEquippedItem = (data: any, setter: any) => {
    data?.map((item: any) => {
      switch (item?.nft_type) {
        case 0:
          setter((prev: any) => ({ ...prev, hair: item }));
          break;
        case 1:
          setter((prev: any) => ({ ...prev, nose: item }));
          break;
        case 2:
          setter((prev: any) => ({ ...prev, mouth: item }));
          break;
        case 3:
          setter((prev: any) => ({ ...prev, eye: item }));
          break;
        case 4:
          setter((prev: any) => ({ ...prev, eyebrows: item }));
          break;
        case 5:
          setter((prev: any) => ({ ...prev, ears: item }));
          break;
      }
    });
  };

  const getEquippedNftList = async () => {
    try {
      const res = await fetchNft({
        tbaAddress: tbaLoginData?.tba_address,
        equip: true,
      });
      const data = res?.data?.data;
      handleSetEquippedItem(data, setEquippedItem);
      handleSetEquippedItem(data, setEquippedItemBefore);
    } catch (err) {
      console.log(err);
      toastError('Get equipped NFT list failed, try reconnect your wallet!');
    }
  };

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
    if (isMounted && tbaLoginData?.tba_address) {
      getEquippedNftList();
    }
  }, [isMounted, tbaLoginData?.tba_address]);

  const tabData = [
    { id: 1, title: 'All', type: undefined },
    { id: 2, title: 'Hair', type: 0 },
    { id: 3, title: 'Nose', type: 1 },
    { id: 4, title: 'Mouth', type: 2 },
    { id: 5, title: 'Eye', type: 3 },
    { id: 6, title: 'Eyebrows', type: 4 },
    { id: 7, title: 'Ears', type: 5 },
  ];

  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }
  }, []);

  const handleEquip = (item: any) => {
    if (!address) {
      return;
    }
    handleSetEquippedItem([item], setEquippedItem);
  };

  useEffect(() => {
    let totalPower = 0;
    Object.values(equippedItem).forEach((item) => {
      if (item?.power) {
        totalPower += item.power;
      }
    });
    setPower(totalPower);
  }, [equippedItem]);

  const handleConfirmEquip = async () => {
    if (!address) {
      return;
    }

    setLoading(true);
    try {
      const equippedItemBeforeArr = Object.values(equippedItemBefore as any);
      const idsSet = new Set(
        equippedItemBeforeArr.map((item: any) => item?.token_id)
      );
      const newEquippedItem: any = Object.values(equippedItem as any).filter(
        (item: any) => !idsSet.has(item?.token_id)
      );
      console.log(newEquippedItem);

      const multiCall = newEquippedItem.map((item: any) => ({
        contractAddress: tbaLoginData?.tba_address,
        entrypoint: 'equip_item',
        calldata: CallData.compile({
          contract_address: process.env.NEXT_PUBLIC_ERC721_ITEM as string,
          token_id: cairo.uint256(item?.token_id),
        }),
      }));
      const tx = await account?.execute(multiCall);

      setShowModalWaitTransaction(true);
      const data: any = await provider.waitForTransaction(
        tx?.transaction_hash as any
      );

      const refresh = await Promise.allSettled(
        newEquippedItem.map((item: any) =>
          refreshEquip({
            tba_address: tbaLoginData?.tba_address,
            token_id: item?.token_id,
            slot: item?.nft_type,
          })
        )
      );
      if (!refresh) {
        throw new Error('Refresh equip failed');
      }

      const formData: any = await exportedImage();
      formData.append('token_id', tbaLoginData?.token_id);
      if (formData) await uploadTbaImage(formData, accessToken);

      await Promise.allSettled([getEquippedNftList(), getGameProfile(), ,]);
      if (searchParams?.get('tab') === 'all') {
        await getNftItemList();
      } else {
        router.push('/game/play/inventory?tab=all');
      }

      toastSuccess('Equip success!');
    } catch (error) {
      toastError('Equip failed, try reconnect your wallet!');
      console.log(error);
    } finally {
      setLoading(false);
      setShowModalWaitTransaction(false);
    }
  };

  const elementRef = useRef(null);

  const exportedImage = async () => {
    if (!elementRef.current) return;
    try {
      const canvas = await html2canvas(elementRef.current, {
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      return formData;
    } catch (error) {
      console.error('Error exporting element:', error);
    }
  };

  return (
    accessToken && (
      <div className='layout-container pb-[7rem] pt-[5rem] sm:py-[6rem]'>
        <div className='mt-[2rem] flex max-lg:flex-col gap-[5rem]'>
          <div className='basis-1/3'>
            <p className='text-[48px] font-[500] mt-[1rem] flex items-center justify-center gap-[1rem]'>
              <IconPower width={48} height={48} /> {power}
            </p>
            {/* start */}
            <div className='flex items-center gap-[1rem] max-lg:justify-center max-sm:flex-col'>
              <div className='flex sm:flex-col gap-[1rem]'>
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
                <div
                  id='tba_image_combine'
                  ref={elementRef}
                  className='aspect-square relative rounded-2xl'
                >
                  <CustomImage
                    src={tbaLoginData?.genesis_image}
                    className='rounded-2xl'
                    alt='err'
                    fill
                  />
                  {Object.values(equippedItem)?.map(
                    (item: any) =>
                      item && (
                        <CustomImage
                          src={item?.nft_image}
                          className='rounded-2xl'
                          alt='err'
                          key={item?._id}
                          fill
                        />
                      )
                  )}
                </div>
              </div>

              <div className='flex sm:flex-col gap-[1rem]'>
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
                  {equippedItem?.ears ? (
                    <EquippedItem data={equippedItem?.ears} />
                  ) : (
                    'Ears'
                  )}
                </div>
              </div>
            </div>

            {/* end */}
            <div className='flex justify-center mt-[1rem] gap-[1rem]'>
              <CustomButton
                className='btn-primary uppercase'
                disabled={deepEqual(equippedItem, equippedItemBefore) as any}
                onClick={() => {
                  handleConfirmEquip();
                }}
                loading={loading}
              >
                Confirm
              </CustomButton>
              <CustomButton
                className='btn-primary uppercase'
                disabled={deepEqual(equippedItem, equippedItemBefore) as any}
                onClick={() => {
                  setEquippedItem(equippedItemBefore);
                }}
              >
                Reset
              </CustomButton>
            </div>
          </div>

          <div className='basis-2/3 bg-white rounded-[16px] p-[24px] items-start'>
            <h1 className='text-[36px] font-[500] text-[#0538BD]'>INVENTORY</h1>
            <div className='pb-[24px] pt-[12px]'>
              <Tab tabData={tabData} activeTab={activeTab} />
            </div>

            <div className='grid lg:grid-cols-5 sm:grid-cols-4 grid-cols-2 gap-[12px] overflow-y-auto max-h-[25rem]'>
              {!loadingNft ? (
                nftItemList?.length > 0 ? (
                  nftItemList?.map((item: any, index: any) => (
                    <div
                      key={item?._id}
                      onClick={() => {
                        setSelectedNft(item);
                      }}
                      className={`group relative rounded-2xl bg-slate-100`}
                    >
                      <div className='group-hover:flex hidden flex-col items-center gap-[0.5rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999]'>
                        {!item?.equip && (
                          <CustomButton
                            onClick={() => {
                              handleEquip(item);
                            }}
                            className='btn-primary'
                          >
                            Equip
                          </CustomButton>
                        )}
                        <CustomButton
                          onClick={() => {
                            window.open(
                              `${process.env.NEXT_PUBLIC_STARKSCAN_URL + '/nft/' + item?.collection_address + '/' + item?.token_id}`,
                              '_blank'
                            );
                          }}
                          className='btn-secondary  '
                        >
                          Detail
                        </CustomButton>
                      </div>

                      <div className='group-hover:blur-sm rounded-2xl relative transition-all flex flex-col cursor-pointer'>
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
                          <div
                            style={{
                              border: `3px solid ${rankMapping(item?.nft_rank).bg}`,
                            }}
                            className='aspect-square relative rounded-t-2xl'
                          >
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

                        <div
                          className={`${item?.equip && '!bg-[#E3FD5E]'} bg-[#F4FEC1] rounded-b-2xl`}
                        >
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
