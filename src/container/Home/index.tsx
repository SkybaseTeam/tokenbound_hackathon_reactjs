'use client';
import React, { useEffect, useState } from 'react';

import CardMarketplace from '@/components/CardMarketplace';
import CardMint from '@/components/CardMint';
import ModalBuyNFT from '@/components/modal/ModalBuyNFT';
import { collectionData } from '@/fetching/client/mint';
import { toastError } from '@/utils/toast';
import useMounted from '@/hook/useMounted';
import { listedNFT } from '@/fetching/client/home';
import NftSkeleton from '@/components/custom/CustomSkeleton/nftSkeleton';

const HomeContainer = () => {
  const [openModalBuyNTF, setOpenModalBuyNTF] = useState(false);
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
    <div className='layout-container my-[3rem]'>
      <ModalBuyNFT
        open={openModalBuyNTF}
        onCancel={() => {
          setOpenModalBuyNTF(false);
        }}
        selectedNFT={selectedNFT}
      />
      <h1 className='text-[32px] font-[700]  mb-[2rem]'>Mint Now</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1rem]'>
        {collection?.length !== undefined ? (
          collection?.map((item: any) => (
            <div key={item?._id}>
              <CardMint data={item} />
            </div>
          ))
        ) : (
          <NftSkeleton />
        )}
      </div>

      <h1 className='text-[32px] font-[700] mb-[2rem] mt-[5rem]'>
        Marketplace
      </h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[1rem]'>
        {listedNFTData?.length !== undefined
          ? listedNFTData?.map((item: any) => (
              <div key={item?._id}>
                <CardMarketplace
                  data={item}
                  setOpenModalBuyNTF={setOpenModalBuyNTF}
                  setSelectedNFT={setSelectedNFT}
                />
              </div>
            ))
          : [...new Array(5)].map((_, index) => <NftSkeleton key={index} />)}
      </div>
    </div>
  );
};

export default HomeContainer;
