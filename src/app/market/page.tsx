'use client';
import React, { useEffect, useState } from 'react';

import CardMarketplace from '@/components/CardMarketplace';
import CardMint from '@/components/CardMint';
import ModalBuyNFT from '@/components/modal/ModalBuyNFT';
import { toastError } from '@/utils/toast';
import useMounted from '@/hook/useMounted';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import CustomImage from '@/components/custom/CustomImage';
import CustomButton from '@/components/custom/CustomButton';
import CustomInput from '@/components/custom/CustomInput';
import IconSearch from '@/assets/icons/IconSearch';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import ModalCancelListNFT from '@/components/modal/ModalCancelListNFT';
import { fetchListedTba } from '@/fetching/client/tba';
import { useAccount } from '@starknet-react/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListNftSkeleton from '@/components/custom/CustomSkeleton/ListNftSkeleton';
import { formatStarknet } from '@/utils';
import { useStore } from '@/context/store';

let page = 2;

const MarketContainer = () => {
  const [openModalBuyNTF, setOpenModalBuyNTF] = useState(false);
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [openModalCancelListNFT, setOpenModalCancelListNFT] = useState(false);
  const { isMounted } = useMounted();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const { listedTba, setListedTba } = useStore();
  const { address } = useAccount();

  useEffect(() => {
    if (!isMounted) return;
    getListedTba();
  }, [isMounted]);

  const LIMIT = 7;

  const getListedTba = async () => {
    try {
      page = 2;
      window.scrollTo(0, 0);
      fetchListedTba({ page: 1, limit: LIMIT, listing: true }).then((res) => {
        setListedTba(res.data);
      });
    } catch (err) {
      toastError('Get profile failed');
      console.log(err);
    }
  };

  const getMoreListedTba = async () => {
    try {
      fetchListedTba({ page, limit: LIMIT, listing: true }).then((res) => {
        const data = res?.data;
        setListedTba((prev: any) => ({
          pagination: data?.pagination,
          data: [...prev?.data, ...data?.data],
        }));
      });
      page++;
    } catch (err) {
      toastError('Get listed tba failed');
      console.log(err);
    }
  };

  return (
    <div className='pt-[6rem] sm:pt-[8rem] pb-[8rem] md:px-[32px]'>
      <ModalTbaDetail
        open={openModalTbaDetail}
        onCancel={() => {
          setOpenModalTbaDetail(false);
        }}
        setOpenModalBuyNTF={setOpenModalBuyNTF}
        selectedNFT={selectedNFT}
        showBuy={selectedNFT?.owner_address !== formatStarknet(address)}
      />
      <ModalBuyNFT
        open={openModalBuyNTF}
        onCancel={() => {
          setOpenModalBuyNTF(false);
        }}
        selectedNFT={selectedNFT}
      />
      <ModalCancelListNFT
        open={openModalCancelListNFT}
        onCancel={() => {
          setOpenModalCancelListNFT(false);
        }}
        data={selectedNFT}
      />

      <div className='mb-[64px] sm:mb-[97px] flex flex-col items-center px-[16px] md:px-[32px]'>
        <CustomImage
          src='/images/marketplace/title.webp'
          width={806}
          height={74}
          alt='err'
        />
        <p className='text-[16px] font-[300] text-white mt-[16px] max-lg:text-center'>
          Find rare and exciting Tokenbound assets on the Marketplace, your
          one-stop shop for buying and selling.
        </p>
      </div>

      <div className=' bg-white w-full px-[16px] sm:px-[32px] py-[53px] lg:px-[90px] lg:py-[84px] rounded-[32px] gap-[1rem] max-w-[1440px] mx-auto'>
        <div className='flex items-center gap-[16px]'>
          <CustomInput
            prefix={<IconSearch />}
            placeholder='Search'
            className='w-[443px]'
          />
          <CustomButton className='w-[163px] btn-primary'>Search</CustomButton>
        </div>

        <div className='mt-[40px] '>
          {listedTba !== undefined ? (
            listedTba?.data?.length > 0 ? (
              <InfiniteScroll
                dataLength={listedTba?.data?.length}
                next={getMoreListedTba}
                hasMore={listedTba?.pagination?.hasMore}
                loader={<ListNftSkeleton />}
              >
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]'>
                  <CardMint />
                  {listedTba?.data?.map((item: any, index: any) => (
                    <div key={item?._id || index}>
                      <CardMarketplace
                        data={item}
                        setOpenModalTbaDetail={setOpenModalTbaDetail}
                        setOpenModalBuyNTF={setOpenModalBuyNTF}
                        setOpenModalCancelListNFT={setOpenModalCancelListNFT}
                        setSelectedNFT={setSelectedNFT}
                      />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            ) : (
              <div className='text-[#031F68]'>No Data!</div>
            )
          ) : (
            <ListNftSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketContainer;
