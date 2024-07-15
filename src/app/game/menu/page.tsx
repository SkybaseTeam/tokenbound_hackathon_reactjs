'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import ImageSkeleton from '@/components/custom/CustomSkeleton/ImageSkeleton';
import { useStore } from '@/context/store';
import { collectionData } from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useContract, useProvider } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import erc721ABI from '@/abi/erc721.json';
import erc20ABI from '@/abi/erc20.json';
import CustomProgress from '@/components/custom/CustomProgress';
import { CallData } from 'starknet';
import TbaProfile from '@/components/TbaProfile';

const Menu = () => {
  const router = useRouter();
  const { isConnected, account, address } = useAccount();
  const { connectWallet, getDcoin, accessToken } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const { isMounted } = useMounted();
  const [remainingPool, setRemainingPool] = useState<any>(0);

  const MINT_PRICE = 10;

  const TOTAL_POOL_MINT = 1000;

  const { contract: erc20Contract } = useContract({
    abi: erc20ABI,
    address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS,
  });

  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS,
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

    getRemainingPool();
    const interval = setInterval(() => {
      getRemainingPool();
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  const onMint = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const tx = await account?.execute([
        {
          contractAddress: process.env
            .NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS as string,
          entrypoint: 'create_account',
          calldata: CallData.compile({
            implementation_hash: process.env
              .NEXT_PUBLIC_ACCOUNT_CLASSHASH as string,
            token_contract: process.env
              .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
            salt: 123,
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      toastSuccess('Mint success');
      getDcoin();
      getRemainingPool();
      console.log('tx hash', tx);
    } catch (err) {
      console.log(err);
      toastError('Mint failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='layout-container py-[8rem] flex flex-col items-center'>
      <TbaProfile />

      <CustomButton
        onClick={() => {
          router.push('/game/menu/play');
        }}
        className='btn-primary w-[183px] animate-bounce mt-[5rem] sm:mt-[10rem]'
      >
        Play Now
      </CustomButton>

      <div className='bg-white rounded-[32px] pt-[86px] pb-[110px] text-[#031F68] w-full mt-[10rem]'>
        <div className='layout-container flex flex-col items-center'>
          <h2 className='text-[48px] font-[500] font-glancyr max-sm:text-center '>
            Mint the Item for your Token-Bound Account
          </h2>
          <p className='max-sm:text-center'>
            (This will increase your Token-Bound Account Power)
          </p>
          <div className=' w-full mt-[63px]'>
            <div className='flex justify-center items-center gap-[56px] max-sm:flex-col'>
              <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[484px] max-sm:w-full '>
                <div className='aspect-square relative rounded-2xl'>
                  <CustomImage
                    src='/images/default.webp'
                    className='rounded-2xl'
                    alt='err'
                    fill
                  />
                </div>
              </div>
              <div className='w-[566px] max-sm:w-full flex flex-col'>
                <CustomImage
                  src='/images/mint/like.webp'
                  width={133}
                  height={44}
                  alt='err'
                />
                <h1 className='text-[30px] font-[400] font-glancyr my-[21px]'>
                  Bling Token-Bound Item
                </h1>
                <div className='flex items-center font-glancyr text-[16px] font-[300] text-[#546678] mb-[2px] justify-between'>
                  <p>Minted Item</p>
                  <p>
                    {remainingPool
                      ? TOTAL_POOL_MINT - Number(remainingPool)
                      : 0}
                    /{TOTAL_POOL_MINT}
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
                />
                <div className='flex items-center gap-[20px] my-[20px] font-glancyr'>
                  <p className='text-[16px] font-[300] text-[#546678]'>Price</p>
                  <p className='text-[30px] font-[400] text-[#031F68]'>
                    100 BLING
                  </p>
                </div>
                <div className='flex justify-end'>
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
    </div>
  );
};

export default Menu;
