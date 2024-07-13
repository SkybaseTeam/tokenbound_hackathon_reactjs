'use client';
import React, { useEffect, useState } from 'react';

import CardMarketplace from '@/components/CardMarketplace';
import CardMint from '@/components/CardMint';
import ModalBuyNFT from '@/components/modal/ModalBuyNFT';
import { collectionData } from '@/fetching/client/mint';
import { toastError, toastSuccess } from '@/utils/toast';
import useMounted from '@/hook/useMounted';
import { listedNFT } from '@/fetching/client/home';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import CustomImage from '@/components/custom/CustomImage';
import CustomButton from '@/components/custom/CustomButton';
import CustomInput from '@/components/custom/CustomInput';
import IconSearch from '@/assets/icons/IconSearch';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';

const MarketContainer = () => {
  const [openModalBuyNTF, setOpenModalBuyNTF] = useState(false);
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [collection, setCollection] = useState<any>();
  const [listedNFTData, setListedNFTData] = useState<any>();
  const { isMounted } = useMounted();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);

  useEffect(() => {
    if (!isMounted) return;

    const getHomeData = async () => {
      try {
        const [collectionResponse, listedNFTResponse]: any =
          await Promise.allSettled([collectionData(), listedNFT()]);

        const collectionResponseData = collectionResponse?.value?.data?.data;
        setCollection(collectionResponseData);
        const listedNFTResponseData = listedNFTResponse?.value?.data?.data;
        setListedNFTData(listedNFTResponseData);
      } catch (err) {
        toastError('Get Collection Data failed');
        console.log(err);
      }
    };

    getHomeData();
  }, [isMounted]);

  return (
    <div className='bg-[url("/images/bg.webp")] pt-[8rem] pb-[8rem] bg-center bg-cover bg-no-repeat bg-fixed'>
      <ModalTbaDetail
        open={openModalTbaDetail}
        onCancel={() => {
          setOpenModalTbaDetail(false);
        }}
        setOpenModalBuyNTF={setOpenModalBuyNTF}
        selectedNFT={selectedNFT}
      />
      <ModalBuyNFT
        open={openModalBuyNTF}
        onCancel={() => {
          setOpenModalBuyNTF(false);
        }}
        selectedNFT={selectedNFT}
      />

      <div className='mb-[97px] flex flex-col items-center'>
        <CustomImage
          src='/images/marketplace/title.webp'
          width={806}
          height={74}
          alt='err'
        />
        <p className='text-[16px] font-[300] text-white mt-[16px]'>
          Find rare and exciting Tokenbound assets on the Marketplace, your
          one-stop shop for buying and selling.
        </p>
      </div>

      <div className=' bg-white w-full px-[90px] py-[84px] rounded-[32px] gap-[1rem] max-w-[1440px] mx-auto'>
        <div className='flex items-center gap-[16px]'>
          <CustomInput
            prefix={<IconSearch />}
            placeholder='Search'
            className='w-[443px]'
          />
          <CustomButton className='w-[163px] btn-primary'>Search</CustomButton>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-[40px] gap-[16px]'>
          {collection?.length !== undefined ? (
            collection?.map((item: any) => (
              <div key={item?._id}>
                <CardMint data={item} />
              </div>
            ))
          ) : (
            <NftSkeleton />
          )}
          {listedNFTData?.length !== undefined
            ? listedNFTData?.map((item: any) => (
                <div key={item?._id}>
                  <CardMarketplace
                    data={item}
                    setOpenModalTbaDetail={setOpenModalTbaDetail}
                    setOpenModalBuyNTF={setOpenModalBuyNTF}
                    setSelectedNFT={setSelectedNFT}
                  />
                </div>
              ))
            : [...new Array(5)].map((_, index) => <NftSkeleton key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default MarketContainer;
