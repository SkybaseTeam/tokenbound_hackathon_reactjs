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
import CustomTooltip from '@/components/custom/CustomTooltip';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { formatWallet } from '@/utils';
import IconLogout from '@/assets/icons/IconLogout';

const Menu = () => {
  const router = useRouter();
  const { isConnected, account, address } = useAccount();
  const { connectWallet, getDcoin } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<any>([]);
  const { isMounted } = useMounted();
  const [remainingPool, setRemainingPool] = useState<any>(0);
  const [text, copy] = useCopyToClipboard();
  const [point, setPoint] = useState(0);

  useEffect(() => {
    if (!isMounted) return;

    const getHomeData = async () => {
      try {
        const collectionResponse: any = await collectionData();

        const collectionResponseData = collectionResponse?.data?.data;
        setCollection(collectionResponseData[0]);
      } catch (err) {
        toastError('Get Collection Data failed');
        console.log(err);
      }
    };

    getHomeData();
  }, [isMounted]);

  const MINT_PRICE = collection?.mint_price;

  const TOTAL_POOL_MINT = 100;

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
      <div className=''>
        <p className='text-[18px]'>Your Token-Bound Account</p>
        <div className='inline-block'>
          <div className='flex items-center rounded-2xl gap-[12px] px-[12px] py-[10px] text-[16px] font-[400] border border-[#EFFEA3] bg-[#FBFDEB] mt-[1rem]'>
            <CustomImage
              src='/images/default.webp'
              width={70}
              height={70}
              alt='err'
              className='rounded-2xl'
            />
            <div>
              <div className='flex items-center gap-[8px]'>
                <CustomTooltip
                  title='Copied'
                  placement='right'
                  trigger={['click']}
                >
                  <div className='cursor-pointer text-[#031F68]'>
                    <p
                      onClick={() => copy(address as string)}
                      // className='mt-[0.3rem]'
                    >
                      {formatWallet(address)}
                    </p>
                  </div>
                </CustomTooltip>
                <IconLogout
                  className='cursor-pointer'
                  fill='#ef4444'
                  onClick={() => {
                    router.push('/game');
                  }}
                />
              </div>
              <div className='text-[16px] font-[400] text-[#031F68]  flex items-center mt-[8px]'>
                <p>Points: {point.toFixed(3)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <p className='max-sm:text-center'>(This will increase your Token-Bound Account Power)</p>
          <div className=' w-full mt-[63px]'>
            <div className='flex justify-center items-center gap-[56px] max-sm:flex-col'>
              <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[484px] max-sm:w-full '>
                <div className='aspect-square relative rounded-2xl'>
                  {collection?.image ? (
                    <CustomImage
                      src={collection?.image}
                      className='rounded-2xl'
                      alt='err'
                      fill
                    />
                  ) : (
                    <ImageSkeleton />
                  )}
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
