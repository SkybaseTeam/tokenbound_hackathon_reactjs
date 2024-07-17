'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import ImageSkeleton from '@/components/custom/CustomSkeleton/ImageSkeleton';
import { useStore } from '@/context/store';
import {
  collectionData,
  fetchNft,
  refreshNftMintStatus,
} from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useContract, useProvider } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import erc721ItemABI from '@/abi/erc721Item.json';
import erc20ABI from '@/abi/erc20.json';
import CustomProgress from '@/components/custom/CustomProgress';
import { cairo, CallData, selector } from 'starknet';
import TbaProfile from '@/components/TbaProfile';
import { profile } from '@/fetching/client/profile';
import ModalMintTbaSuccess from '@/components/modal/ModalMintTbaSuccess';

const Menu = () => {
  const router = useRouter();
  const { isConnected, account, address } = useAccount();
  const {
    connectWallet,
    getDcoin,
    accessToken,
    tbaLoginData,
    setShowModalWaitTransaction,
    getGameProfile,
  } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const { isMounted } = useMounted();
  const [remainingPool, setRemainingPool] = useState<any>(0);
  const [showModalMintTbaSuccess, setShowModalMintTbaSuccess] = useState(false);
  const [mintedNft, setMintedNft] = useState<any>();

  const MINT_PRICE = 10;

  const TOTAL_POOL_MINT = 1000000000000000000000;

  const { contract: erc20Contract } = useContract({
    abi: erc20ABI,
    address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS,
  });

  const { contract: erc721Contract } = useContract({
    abi: erc721ItemABI,
    address: process.env.NEXT_PUBLIC_ERC721_ITEM,
  });

  const getRemainingPool = async () => {
    const remainingPool = await erc721Contract?.get_remaining_mint(1);
    // console.log('here', Number(remainingPool));
    setRemainingPool(remainingPool);
  };

  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }

    // getRemainingPool();
    // const interval = setInterval(() => {
    //   getRemainingPool();
    // }, 180000);
    // return () => clearInterval(interval);
  }, []);

  const onMint = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setLoading(true);

    try {
      setLoading(true);
      try {
        // mint Item
        const tx = await account?.execute([
          {
            contractAddress: tbaLoginData?.tba_address,
            entrypoint: 'mint_nft',
            calldata: CallData.compile({
              nft_contract: process.env.NEXT_PUBLIC_ERC721_ITEM as string,
              token_contract: process.env
                .NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
            }),
          },
        ]);

        setShowModalWaitTransaction(true);
        const data: any = await provider.waitForTransaction(
          tx?.transaction_hash as any
        );
        console.log(data);
        const tokenId = parseInt(data?.events[4]?.data[2], 16);
        console.log('TokenId', tokenId);
        await Promise.allSettled([
          refreshNftMintStatus({
            token_id: tokenId,
            collection_address: process.env.NEXT_PUBLIC_ERC721_ITEM,
          }),
          // getDcoin(),
          // getRemainingPool(),
        ]);
        const res: any = await fetchNft(
          tbaLoginData?.tba_address?.toLocaleLowerCase()
        );
        setMintedNft(
          res?.data?.data?.find(
            (item: any) => item?.token_id === tokenId.toString()
          )
        );
        setShowModalMintTbaSuccess(true);
      } catch (error) {
        toastError('Mint failed');
        console.log(error);
      } finally {
        setLoading(false);
        setShowModalWaitTransaction(false);
      }
    } catch (err) {
      console.log(err);
      toastError('Mint failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='layout-container py-[5rem] sm:py-[8rem] flex flex-col items-center'>
      <CustomButton
        onClick={() => {
          router.push('/game/menu/play');
        }}
        className='btn-primary w-[183px] animate-bounce mt-[3rem]'
      >
        PLAY NOW
      </CustomButton>

      <TbaProfile />

      <div className='bg-white rounded-[32px] text-[#031F68] mt-[5rem] px-[48px] py-[32px]'>
        <div className='layout-container flex flex-col items-center px-0'>
          <h2 className='text-[38px] font-[500] font-glancyr max-lg:text-center '>
            Increase your Power
          </h2>

          <div className=' w-full mt-[30px]'>
            <div className='flex justify-center items-center gap-[38px] max-sm:flex-col'>
              <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[300px] max-sm:w-full '>
                <div className='aspect-square relative rounded-2xl'>
                  <CustomImage
                    src='https://cryptowalkers.mypinata.cloud/ipfs/QmdXKK6JJgX1bw1J974coE6i9GFDpMUZ7jyNiUvxqa31sN/supducks.png'
                    className='rounded-2xl'
                    alt='err'
                    fill
                  />
                </div>
              </div>
              <div className='max-sm:w-full flex flex-col'>
                {/* <CustomImage
                  src='/images/mint/like.webp'
                  width={133}
                  height={44}
                  alt='err'
                /> */}
                <h1 className='text-[30px] font-[400] font-glancyr my-[10px]'>
                  Bling Gun
                </h1>
                {/* <div className='flex items-center font-glancyr text-[16px] font-[300] text-[#546678] mb-[2px] justify-between'>
                  <p>Minted Item</p>
                  <p>
                    {remainingPool
                      ? TOTAL_POOL_MINT - Number(remainingPool)
                      : 0}
                    /{'Infinity'}
                  </p>
                </div>
                <CustomProgress
                  showInfo={false}
                  percent={
                    remainingPool
                      ? ((TOTAL_POOL_MINT - Number(remainingPool)) /
                          TOTAL_POOL_MINT) *
                        100
                      : 0
                  }
                /> */}
                <div className='flex items-center gap-[20px] my-[20px] font-glancyr'>
                  <p className='text-[16px] font-[300] text-[#546678]'>Price</p>
                  <p className='text-[30px] font-[400] text-[#031F68]'>
                    {MINT_PRICE} BLING
                  </p>
                </div>
                <div className='flex justify-start'>
                  {' '}
                  <CustomButton
                    loading={loading}
                    onClick={onMint}
                    className='btn-primary w-[266px]'
                  >
                    Mint
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalMintTbaSuccess
        open={showModalMintTbaSuccess}
        onCancel={() => {
          setShowModalMintTbaSuccess(false);
        }}
        mintedNft={mintedNft}
      />
    </div>
  );
};

export default Menu;
