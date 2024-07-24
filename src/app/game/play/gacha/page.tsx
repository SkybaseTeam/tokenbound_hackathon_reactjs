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
import { cairo, CallData, selector } from 'starknet';
import ModalMintTbaSuccess from '@/components/modal/ModalMintTbaSuccess';
import { feltToInt, rankMapping } from '@/utils';
import IconInfo from '@/assets/icons/IconInfo';

const Menu = () => {
  const router = useRouter();
  const { isConnected, account, address } = useAccount();
  const {
    connectWallet,
    accessToken,
    tbaLoginData,
    setShowModalWaitTransaction,
    blingTba,
    getBlingOfTba,
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
    if (!address || !tbaLoginData) {
      return;
    }

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
      const tokenId = feltToInt({
        low: parseInt(data?.events[4]?.data[0]),
        high: parseInt(data?.events[4]?.data[1]),
      });
      console.log('TokenId', tokenId);
      const nftMinted: any = await Promise.allSettled([
        refreshNftMintStatus({
          token_id: tokenId,
          collection_address: process.env.NEXT_PUBLIC_ERC721_ITEM,
        }),
        getBlingOfTba(),
        // getDcoin(),
        // getRemainingPool(),
      ]);
      setMintedNft(nftMinted[0]?.value?.data?.data);
      setShowModalMintTbaSuccess(true);
    } catch (error) {
      toastError('Mint failed, try reconnect your wallet!');
      console.log(error);
    } finally {
      setLoading(false);
      setShowModalWaitTransaction(false);
    }
  };

  return (
    accessToken && (
      <div className='layout-container py-[5rem] sm:py-[8rem] flex flex-col items-center'>
        <div className='bg-white rounded-[32px] text-[#031F68]  max-sm:mb-[5rem] p-[32px] sm:px-[48px] py-[32px]  mt-[1rem] sm:mt-[5rem]'>
          <div className='layout-container flex flex-col items-center px-0'>
            <h2 className='text-[38px] font-[500] font-glancyr max-lg:text-center '>
              Increase your Power
            </h2>

            <div className=' w-full mt-[30px]'>
              <div className='flex justify-center items-center gap-[38px] max-sm:flex-col'>
                <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[300px] max-sm:w-full '>
                  <div className='aspect-square relative rounded-2xl'>
                    <CustomImage
                      src='https://res.cloudinary.com/dfnvpr9lg/image/upload/v1721269912/hair/hair531.png'
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

                  <h1 className='text-[30px] font-[400] font-glancyr my-[10px] '>
                    Bling NFT Item
                  </h1>
                  <p className='text-[16px] text-[#546678] max-w-[400px] font-[300] py-[1rem] gap-[0.5rem] whitespace-pre-wrap'>
                    <IconInfo
                      className='inline-block mr-[0.3rem]'
                      fill='#031F68'
                    />
                    After every <span className='font-[400]'>10</span> mints, an {' '}
                    <span className='font-[400]'>A rank</span> item will appear,{' '}
                    <span className='font-[400]'>90</span> mints, an {' '}
                    <span className='font-[400]'>S rank</span> item will appear.
                  </p>
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
                    <p className='text-[16px] font-[300] text-[#546678]'>
                      Price
                    </p>
                    <p className='text-[30px] font-[400] text-[#031F68] flex items-center gap-[15px]'>
                      <CustomImage
                        src='/images/token/bling-big.webp'
                        width={40}
                        height={40}
                        alt='err'
                      />
                      {MINT_PRICE} BLING
                    </p>
                  </div>
                  <div className='flex max-sm:justify-center'>
                    {' '}
                    <CustomButton
                      loading={loading}
                      onClick={onMint}
                      disabled={blingTba < MINT_PRICE}
                      className='btn-primary w-[266px]'
                    >
                      Mint Now
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
    )
  );
};

export default Menu;
