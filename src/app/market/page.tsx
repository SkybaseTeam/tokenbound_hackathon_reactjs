'use client';
import React, { useEffect, useState } from 'react';

import CardMarketplace from '@/components/CardMarketplace';
import CardMint from '@/components/CardMint';
import ModalBuyNFT from '@/components/modal/ModalBuyNFT';
import { toastError } from '@/utils/toast';
import useMounted from '@/hook/useMounted';
import { listedNFT } from '@/fetching/client/home';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import CustomImage from '@/components/custom/CustomImage';
import CustomButton from '@/components/custom/CustomButton';
import CustomInput from '@/components/custom/CustomInput';
import IconSearch from '@/assets/icons/IconSearch';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import ModalCancelListNFT from '@/components/modal/ModalCancelListNFT';
import { useStore } from '@/context/store';

const MarketContainer = () => {
  const [openModalBuyNTF, setOpenModalBuyNTF] = useState(false);
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [openModalCancelListNFT, setOpenModalCancelListNFT] = useState(false);
  const { isMounted } = useMounted();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const { listedNFTData, setListedNFTData } = useStore();

  useEffect(() => {
    if (!isMounted) return;

    const getHomeData = async () => {
      try {
        const [listedNFTResponse]: any = await Promise.allSettled([
          listedNFT(),
        ]);

        const listedNFTResponseData = listedNFTResponse?.value?.data?.data;
        setListedNFTData(listedNFTResponseData);
      } catch (err) {
        toastError('Get Listed Data failed');
        console.log(err);
      }
    };

    getHomeData();
  }, [isMounted]);

  return (
    <div className='pt-[6rem] sm:pt-[8rem] pb-[8rem] md:px-[32px]'>
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

        <div className='grid extra-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[40px] gap-[16px]'>
          <CardMint />

          {listedNFTData !== undefined ? (
            listedNFTData?.length > 0 ? (
              listedNFTData?.map((item: any, index: any) => (
                <div key={item?._id}>
                  <CardMarketplace
                    data={item}
                    setOpenModalTbaDetail={setOpenModalTbaDetail}
                    setOpenModalBuyNTF={setOpenModalBuyNTF}
                    setOpenModalCancelListNFT={setOpenModalCancelListNFT}
                    setSelectedNFT={setSelectedNFT}
                  />
                </div>
              ))
            ) : (
              <div className='text-[#031F68]'>No Data!</div>
            )
          ) : (
            [...new Array(7)].map((_, index) => <NftSkeleton key={index} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketContainer;
