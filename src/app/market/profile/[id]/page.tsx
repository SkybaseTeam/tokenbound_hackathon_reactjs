'use client';

import IconSearch from '@/assets/icons/IconSearch';
import CardProfile from '@/components/CardProfile';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import CustomInput from '@/components/custom/CustomInput';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import ModalCancelListNFT from '@/components/modal/ModalCancelListNFT';
import ModalListNFT from '@/components/modal/ModalListNFT';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import { useStore } from '@/context/store';
import { profile } from '@/fetching/client/profile';
import { formatToken, formatWallet } from '@/utils';
import { toastError } from '@/utils/toast';
import { useAccount, useBalance } from '@starknet-react/core';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [openModalListNFT, setOpenModalListNFT] = useState(false);
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [openModalCancelListNFT, setOpenModalCancelListNFT] = useState(false);
  const { address } = useAccount();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const { dcoin, getProfile, profileData } = useStore();

  useEffect(() => {
    if (!address) return;

    getProfile();
  }, [address]);

  const ethBalance = useBalance({
    address,
    watch: false,
  });

  return (
    <div className='bg-[url("/images/bg.webp")] pt-[6rem] md:pt-[8rem] pb-[8rem] bg-center bg-cover bg-no-repeat bg-fixed md:px-[32px]'>
      <ModalListNFT
        open={openModalListNFT}
        onCancel={() => {
          setOpenModalListNFT(false);
        }}
        data={selectedNFT}
        getProfile={getProfile}
      />
      <ModalCancelListNFT
        open={openModalCancelListNFT}
        onCancel={() => {
          setOpenModalCancelListNFT(false);
        }}
        data={selectedNFT}
        getProfile={getProfile}
      />
      <ModalTbaDetail
        open={openModalTbaDetail}
        onCancel={() => {
          setOpenModalTbaDetail(false);
        }}
        showBuy={false}
        selectedNFT={selectedNFT}
      />

      <div className='flex items-center justify-between max-lg:flex-col max-lg:items-start max-lg:gap-[2rem] max-w-[1260px] mx-auto max-md:px-[16px] max-lg:px-[32px]'>
        <div className='flex items-center gap-[24px]'>
          <CustomImage
            src='/images/default.webp'
            width={163}
            height={163}
            alt='err'
            className='rounded-2xl max-md:w-[100px]'
          />
          <div className='mt-[-1.5rem]'>
            <CustomImage
              src='/images/profile/title.webp'
              width={340}
              height={74}
              className='max-md:w-[200px]'
              alt='err'
            />
            <p className='text-[18px] py-[12px] font-[400]'>
              {formatWallet(address)}
            </p>
            <div className='max-md:hidden border border-[#DCFC36] text-[16px] font-[400] text-[#DCFC36] px-[12px] h-[36px] rounded-[32px] inline-block'>
              <div className=' mt-[0.3rem]'>
                {dcoin && address ? formatToken(dcoin, 18) : 0} BLING
                <span className='px-[10px]'>|</span>
                {ethBalance?.data && address
                  ? parseFloat(
                      formatToken(ethBalance?.data?.value as any, 18)
                    ).toFixed(3) + ' '
                  : '0'}{' '}
                {ethBalance?.data?.symbol || 'ETH'}
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-[3rem]'>
          {/* <div className='md:text-right'>
            <p className='text-[18px] font-[400]'>Rank</p>
            <p className='text-[24px] md:text-[48px] font-[500] text-[#DCFC36]'>
              #100
            </p>
          </div> */}
          <div className='md:text-right'>
            <p className='text-[18px] font-[400]'>Owned Tokens</p>
            <p className='text-[24px] md:text-[48px] font-[500] text-[#DCFC36]'>
              {profileData?.length || 0}
            </p>
          </div>
          <div className='md:text-right'>
            <p className='text-[18px] font-[400]'>Listed Tokens</p>
            <p className='text-[24px] md:text-[48px] font-[500] text-[#DCFC36]'>
              {profileData?.filter((item: any) => item?.listing === true)
                ?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className=' bg-white w-full px-[16px] sm:px-[32px] py-[53px] lg:px-[90px] lg:py-[84px] rounded-[32px] gap-[1rem] max-w-[1440px] mx-auto mt-[3rem] md:mt-[5rem]'>
        <div className='flex items-center gap-[16px]'>
          <CustomInput
            prefix={<IconSearch />}
            placeholder='Search'
            className='w-[443px]'
          />
          <CustomButton className='w-[163px] btn-primary'>Search</CustomButton>
        </div>

        <div className='grid extra-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[40px] gap-[16px]'>
          {profileData?.length !== undefined
            ? profileData?.map((item: any, index: any) => (
                <div key={item?._id || index}>
                  <CardProfile
                    data={item}
                    setOpenModalListNFT={setOpenModalListNFT}
                    setOpenModalCancelListNFT={setOpenModalCancelListNFT}
                    setOpenModalTbaDetail={setOpenModalTbaDetail}
                    setSelectedNFT={setSelectedNFT}
                  />
                </div>
              ))
            : [...new Array(4)].map((_, index) => <NftSkeleton key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Profile;
