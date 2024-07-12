'use client';

import IconSearch from '@/assets/icons/IconSearch';
import CardProfile from '@/components/CardProfile';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import CustomInput from '@/components/custom/CustomInput';
import ModalCancelListNFT from '@/components/modal/ModalCancelListNFT';
import ModalListNFT from '@/components/modal/ModalListNFT';
import { useStore } from '@/context/store';
import { profile } from '@/fetching/client/profile';
import { formatToken, formatWallet } from '@/utils';
import { toastError } from '@/utils/toast';
import { useAccount, useBalance } from '@starknet-react/core';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [openModalListNFT, setOpenModalListNFT] = useState(false);
  const [openModalCancelListNFT, setOpenModalCancelListNFT] = useState(false);
  const { address } = useAccount();
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const { dcoin } = useStore();

  useEffect(() => {
    if (!address) return;

    const getProfile = async () => {
      try {
        const profileResponse: any = await profile();
        const data = profileResponse?.data?.data;
        console.log(profileResponse);
        setProfileData(data);
      } catch (err) {
        toastError('Get profile failed');
        console.log(err);
      }
    };

    getProfile();
  }, [address]);

  const ethBalance = useBalance({
    address,
    watch: false,
  });

  return (
    <div className='bg-[url("/images/bg.webp")] pt-[8rem] pb-[8rem] bg-center bg-cover bg-no-repeat bg-fixed'>
      <ModalListNFT
        open={openModalListNFT}
        onCancel={() => {
          setOpenModalListNFT(false);
        }}
        data={selectedNFT}
      />
      <ModalCancelListNFT
        open={openModalCancelListNFT}
        onCancel={() => {
          setOpenModalCancelListNFT(false);
        }}
        data={selectedNFT}
      />

      <div className='flex items-center justify-between max-w-[1260px] mx-auto'>
        <div className='flex items-center gap-[24px]'>
          <CustomImage
            src='/images/default.webp'
            width={163}
            height={163}
            alt='err'
            className='rounded-2xl'
          />
          <div className=''>
            <CustomImage
              src='/images/profile/title.webp'
              width={340}
              height={74}
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

        <div className='grid grid-cols-3 gap-[3rem]'>
          <div className='text-right'>
            <p className='text-[18px] font-[400]'>Rank</p>
            <p className='text-[48px] font-[500] text-[#DCFC36]'>#100</p>
          </div>
          <div className='text-right'>
            <p className='text-[18px] font-[400]'>Owned Tokens</p>
            <p className='text-[48px] font-[500] text-[#DCFC36]'>5</p>
          </div>
          <div className='text-right'>
            <p className='text-[18px] font-[400]'>Listed Tokens</p>
            <p className='text-[48px] font-[500] text-[#DCFC36]'>4</p>
          </div>
        </div>
      </div>

      <div className=' bg-white w-full px-[90px] py-[84px] rounded-[32px] gap-[1rem] max-w-[1440px] mx-auto mt-[5rem]'>
        <div className='flex items-center gap-[16px]'>
          <CustomInput
            prefix={<IconSearch />}
            placeholder='Search'
            className='w-[443px]'
          />
          <CustomButton className='w-[163px] btn-primary'>Search</CustomButton>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[1rem] mt-[40px]'>
          {[...Array(5)]?.map((item: any, index: any) => (
            <div key={item?._id || index}>
              <CardProfile
                data={item}
                setOpenModalListNFT={setOpenModalListNFT}
                setOpenModalCancelListNFT={setOpenModalCancelListNFT}
                setSelectedNFT={setSelectedNFT}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
