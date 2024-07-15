'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import { useStore } from '@/context/store';
import { login } from '@/fetching/client/game';
import { toastError } from '@/utils/toast';
import { useAccount, useSignTypedData } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArraySignatureType, typedData, TypedData } from 'starknet';

const Play = () => {
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const router = useRouter();
  const { profileData, getProfile, setTbaLoginData, setAccessToken } =
    useStore();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData({ primaryType: 'Validate' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    getProfile(address);
  }, [address]);

  const onLoginGame = async (item: any) => {
    setLoading(true);
    try {
      // Sign argentX Address
      const signature = await handleSign();
      console.log(signature);

      // Login
      const loginData = await login({
        address: address,
        tba_address: item?.tba_address,
        signature: signature[0],
        sign_data: signData,
        token_id: item?.token_id,
      });
      console.log(loginData);

      setAccessToken(loginData?.data?.data?.token);

      // Set Tba Login Data
      setTbaLoginData(item);

      // Join Game
      router.push(`/game/menu`);
    } catch (error) {
      toastError('Login Game failed');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    const typedDataValidate: TypedData = signData;
    const msgHash = typedData.getMessageHash(typedDataValidate, address as any);
    const arraySignature = (await signTypedDataAsync(
      typedDataValidate
    )) as ArraySignatureType;
    let signatureS = '';
    return [arraySignature, signatureS, msgHash];
  };

  const signData = {
    types: {
      StarkNetDomain: [
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' },
      ],
      Validate: [
        { name: 'signer', type: 'felt' },
        { name: 'expire', type: 'string' },
      ],
    },
    primaryType: 'Validate',
    domain: {
      name: 'BlingBling',
      version: '1',
      chainId: '0x534e5f5345504f4c4941',
    },
    message: {
      signer: address,
      expire: Date.now() + 1000 * 60 * 5,
    },
  };

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
        <h1 className='text-[32px] sm:text-[48px]'>
          Select your Token-Bound Account to Play game!
        </h1>
        <div className='grid extra-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[40px] gap-[16px] w-full'>
          {profileData?.length !== undefined
            ? profileData?.map((item: any, index: any) => (
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
                          src={item?.tba_image}
                          fill
                          alt='Nft'
                          className='object-cover w-full rounded-2xl group-hover:scale-110 transition-all duration-500 ease-in-out'
                        />
                      </div>
                      <div className='my-[16px]'>
                        <p className='text-[18px] uppercase font-[400] truncate'>
                          {item?.tba_name || 'NFT Name'}
                        </p>
                      </div>
                    </div>

                    <CustomButton
                      onClick={() => {
                        setSelectedNFT(item);
                        onLoginGame(item);
                      }}
                      className='btn-primary w-full'
                      loading={selectedNFT?._id === item?._id && loading}
                    >
                      Login Game
                    </CustomButton>
                  </div>
                </div>
              ))
            : [...new Array(4)].map((_, index) => <NftSkeleton key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Play;